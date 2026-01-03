"use client";
import React, { createContext, useContext, useRef, useEffect, useReducer, useMemo } from 'react';
import { BoardState, Board as BoardType, List, Card, Comment } from '@/utils/types';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';
import * as uuid from 'uuid'
import { seedBoard } from '@/utils/seed';

export const BOARD_EVENTS = {
  BOARD_TITLE_UPDATED: 'boardTitleUpdated',
  LIST_ADDED: 'listAdded',
  LIST_TITLE_UPDATED: 'listTitleUpdated',
  LIST_DELETED: 'listDeleted',
  LISTS_REORDERED: 'listsReordered',
  CARD_ADDED: 'cardAdded',
  CARD_TITLE_UPDATED: 'cardTitleUpdated',
  CARD_DELETED: 'cardDeleted',
  CARD_MOVED: 'cardMoved',
  COMMENT_ADDED: 'commentAdded',
  CARD_SELECTED_TOGGLED: 'cardSelectedToggled',
} as const;

export type BoardEventName = typeof BOARD_EVENTS[keyof typeof BOARD_EVENTS];

// Core-logic: Board state management
export class Board {
  allIDs(){
    return Object.keys(this.state.lists).concat(Object.keys(this.state.cards));
  }
  getDraggingIndicatorText():string  {
    const sourceName = this.getNameByID(this.state.board.draggingSourceID||'');
    const overName = this.getNameByID(this.state.board.dragOverID || '');
    const isOverCard = !!this.state.cards[this.state.board.dragOverID|| ''];
    const isSrcCard = !!this.state.cards[this.state.board.draggingSourceID || ''];
    
    const preposition = isOverCard==isSrcCard ? 'before' : 'to';
    return `Moving "${sourceName}" ${preposition} "${overName}"`;
  }
    state: BoardState;
  private onSave: (state: BoardState) => void;
  private idCounter = 0;
  private listeners = new Map<BoardEventName, Array<(data?: any) => void>>();

  constructor(initialState: BoardState | null, onSave: (state: BoardState) => void) {
    this.onSave = onSave;
    if (initialState) {
      this.state = { ...initialState };
      // Initialize id counter based on existing ids
      const allIds = [
        initialState.board.id,
        ...Object.keys(initialState.lists),
        ...Object.keys(initialState.cards),
        ...Object.keys(initialState.comments),
      ];
      this.idCounter = Math.max(...allIds.map(id => parseInt(id.replace(/\D/g, '')) || 0)) + 1;
    } else {
      seedBoard(this);
      this.state = this.getState();
    }
  }

  public on(event: BoardEventName, listener: (data?: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  public offAll() {
    this.listeners.clear()
  }

  private emit(event: BoardEventName, data?: any) {
    const list = this.listeners.get(event);
    if (list) {
      list.forEach(fn => fn(data));
    }
  }

  private arraysEqual(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((val, idx) => val === b[idx]);
  }

  private generateId(): string {
    return `id${this.idCounter++}`;
  }

  getState(): BoardState {
    return { ...this.state };
  }

  updateState(newState: BoardState) {
    this.state = { ...newState };
  }

  private save() {
    this.onSave(this.state);
  }

  // Core-logic: Board operations
  updateBoardTitle(name: string) {
    if (name === this.state.board.name) return;
    this.state.board.name = name;
    this.state.board.revision++;
    this.save();
    this.emit('boardTitleUpdated', { name });
  }

  addList(name: string) {
    const id = this.generateId();
    const list: List = { id, name, cards: [], revision: 0 };
    this.state.lists[id] = list;
    this.state.board.lists.push(id);
    this.state.board.revision++;
    this.save();
    this.emit('listAdded', { id, name });
  }

  updateListTitle(id: string, name: string) {
    if (!this.state.lists[id] || name === this.state.lists[id].name) return;
    this.state.lists[id].name = name;
    this.state.lists[id].revision++;
    this.state.board.revision++;
    this.save();
    this.emit('listTitleUpdated', { id, name });
  }

  deleteList(id: string) {
    if (this.state.lists[id]) {
      // Remove associated cards and comments
      this.state.lists[id].cards.forEach(cardId => {
        if (this.state.cards[cardId]) {
          this.state.cards[cardId].comments.forEach(commentId => {
            delete this.state.comments[commentId];
          });
          delete this.state.cards[cardId];
        }
      });
      delete this.state.lists[id];
      this.state.board.lists = this.state.board.lists.filter(listId => listId !== id);
      this.state.board.revision++;
      this.save();
      this.emit('listDeleted', { id });
    }
  }

  reorderLists(newOrder: string[]) {
    if (this.arraysEqual(newOrder, this.state.board.lists)) return;
    this.state.board.lists = newOrder;
    this.state.board.revision++;
    this.save();
    this.emit('listsReordered', { newOrder });
    this.editMode('all',false);

  }

  addCard(listId: string, title: string) {
    if (this.state.lists[listId]) {
      const id = this.generateId();
      const card: Card = { id, title, description: undefined, comments: [], revision: 0, selected: false };
      this.state.cards[id] = card;
      this.state.lists[listId].cards.push(id);
      this.state.lists[listId].revision++;
      this.state.board.revision++;
      this.save();
      this.emit('cardAdded', { id, listId, title });
    }
  }

  updateCardTitle(id: string, title: string) {
    if (!this.state.cards[id] || title === this.state.cards[id].title) return;
    this.state.cards[id].title = title;
    this.state.cards[id].revision++;
    // Update list revision
    for (const list of Object.values(this.state.lists)) {
      if (list.cards.includes(id)) {
        list.revision++;
        break;
      }
    }
    this.state.board.revision++;
    this.save();
    this.emit('cardTitleUpdated', { id, title });
  }

  deleteCard(id: string) {
    if (this.state.cards[id]) {
      // Remove associated comments
      this.state.cards[id].comments.forEach(commentId => {
        delete this.state.comments[commentId];
      });
      delete this.state.cards[id];
      // Remove from list and update revision
      for (const list of Object.values(this.state.lists)) {
        if (list.cards.includes(id)) {
          list.cards = list.cards.filter(cardId => cardId !== id);
          list.revision++;
        }
      }
      this.state.board.revision++;
      this.save();
      this.emit('cardDeleted', { id });
    }
  }
  getListID(cardId:string){
    if(cardId==null || !this.state.cards[cardId]) return null;
    return Object.values(this.state.lists).find(l => l.cards.includes(cardId))?.id;
  }
  getNameByID(id:string){
    const card=this.state.cards[id  ];
    if(card){
      return card.title
    }
    const list=this.state.lists[id];
    if(list){
      return list.name
    }
    return ''
  }
  moveCard(cardId: string, toListId: string, index?: number) {
    if (!this.state.cards[cardId] || !this.state.lists[toListId]) return;
    const currentList = Object.values(this.state.lists).find(l => l.cards.includes(cardId));
    if (!currentList) return;
    const currentIndex = currentList.cards.indexOf(cardId);
    const targetIndex = index !== undefined ? index : this.state.lists[toListId].cards.length;
    if (currentList.id === toListId && currentIndex === targetIndex) return;
    // Remove from current list
    for (const list of Object.values(this.state.lists)) {
      if (list.cards.includes(cardId)) {
        list.cards = list.cards.filter(id => id !== cardId);
        list.revision++;
      }
    }
    // Add to new list at specified index or end
    const cards = this.state.lists[toListId].cards;
    if (index !== undefined && index >= 0 && index <= cards.length) {
      cards.splice(index, 0, cardId);
    } else {
      cards.push(cardId);
    }
    this.state.lists[toListId].revision++;
    this.state.board.revision++;
    this.save();
    this.emit('cardMoved', { cardId, toListId, index });
  this.editMode('all',false);
  }

  addComment(cardId: string, text: string, author?: string) {
    if (this.state.cards[cardId]) {
      const id = this.generateId();
      const comment: Comment = { id, text, author, timestamp: new Date(), revision: 0 };
      this.state.comments[id] = comment;
      this.state.cards[cardId].comments.push(id);
      this.state.cards[cardId].revision++;
      // Update list revision
      for (const list of Object.values(this.state.lists)) {
        if (list.cards.includes(cardId)) {
          list.revision++;
          break;
        }
      }
      this.state.board.revision++;
      this.save();
      this.emit('commentAdded', { id, cardId, text, author });
    }
  }
  setDragOverID(id:string){
    this.state.board.dragOverID=id;
    
    if(!id){
      for (const listId of  Object.keys(this.state.lists)){
        this.state.lists[listId].dragging=false;  
      }
      return ;
    }

    const list=this.state.lists[id];
    if(list){
      list.draggingTimeStamp=+Date.now();
      list.dragging=true;
      this.state.board.dragOverListID=list.id;
    }
    const card=this.state.cards[id];
    const listOfCard=this.state.lists[this.getListID(id) || ''];
    if(card){
      listOfCard.draggingTimeStamp=+Date.now();
    }
  }
  editMode(id:string,nextState:boolean){
     const card= this.state.cards[id];
     if(id=='all'){
      if(nextState) throw new Error('all mode must be false');
      for (const cardId of  Object.keys(this.state.cards)){
        this.state.cards[cardId].editing=nextState;  
      }
      for (const listId of  Object.keys(this.state.lists)){
        this.state.lists[listId].editing=nextState;  
      }
      return ;
     }
     if(card){
       card.editing=nextState;
     } 
     const list= this.state.lists[id];
     if(list){
       list.editing=nextState;
     } 
  }
  setDraggingSource(id:string){
    this.state.board.draggingSourceID=id;
  }
}

const BoardContext = createContext<Board | null>(null);

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useLocalStorageState<BoardState | null>('board-state', null);

  const boardRef = useRef<Board | null>(null);

  if (!boardRef.current) {
    boardRef.current = new Board(state, setState);
  }

  useEffect(() => {
    if (boardRef.current && state !== null) {
      boardRef.current.updateState(state);
    }
  }, [state]);

  return (
    <BoardContext.Provider value={boardRef.current}>
      {children}
    </BoardContext.Provider>
  );
};

export const useBoardState = (): Board => {
  const board = useContext(BoardContext);
  if (!board) {
    throw new Error('useBoardState must be used within a BoardProvider');
  }
  return board;
};