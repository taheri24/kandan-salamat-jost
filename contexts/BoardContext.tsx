"use client";
import React, { createContext, useContext, useRef, useEffect } from 'react';
import { BoardState, Board as BoardType, List, Card, Comment } from '@/utils/types';
import { useLocalStorageState } from '@/hooks/useLocalStorageState';

// Core-logic: Board state management
export class Board {
  private state: BoardState;
  private onSave: (state: BoardState) => void;
  private idCounter = 0;

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
      this.state = {
        board: { id: this.generateId(), name: 'My Board', lists: [], revision: 0 },
        lists: {},
        cards: {},
        comments: {},
      };
    }
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
    this.state.board.name = name;
    this.state.board.revision++;
    this.save();
  }

  addList(name: string) {
    const id = this.generateId();
    const list: List = { id, name, cards: [], revision: 0 };
    this.state.lists[id] = list;
    this.state.board.lists.push(id);
    this.state.board.revision++;
    this.save();
  }

  updateListTitle(id: string, name: string) {
    if (this.state.lists[id]) {
      this.state.lists[id].name = name;
      this.state.lists[id].revision++;
      this.state.board.revision++;
      this.save();
    }
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
    }
  }

  reorderLists(newOrder: string[]) {
    this.state.board.lists = newOrder;
    this.state.board.revision++;
    this.save();
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
    }
  }

  updateCardTitle(id: string, title: string) {
    if (this.state.cards[id]) {
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
    }
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
    }
  }
 
  moveCard(cardId: string, toListId: string, index?: number) {
    if (this.state.cards[cardId] && this.state.lists[toListId]) {
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
    }
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
    }
  }

  toggleCardSelected(id: string) {
    if (this.state.cards[id]) {
      this.state.cards[id].selected = !this.state.cards[id].selected;
      this.state.cards[id].revision++;
      this.save();
    }
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