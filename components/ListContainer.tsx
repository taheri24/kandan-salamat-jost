"use client"
'use client';

import React, { useReducer, useRef, useState, useEffect } from 'react';
import { useBoardState } from '@/contexts/BoardContext';
import { ListColumn } from './ListColumn';
import { DndContext, DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import styles from '@/styles/ListContainer.module.scss';
import { ToastContainer, toast } from 'react-toastify';
import { BOARD_EVENTS } from '@/contexts/BoardContext';

interface ListContainerProps {
  onCardClick?: (cardId: string) => void;
}

export default function ListContainer({ onCardClick }: ListContainerProps) {
  const [key, updateKey] = useReducer(a => a + 1, 0);
  const board = useBoardState();
  const [isAdding, setIsAdding] = useState(false);
  const [newListName, setNewListName] = useState('');
  const state = board.getState();
  const [draggingId,setDraggingId] = useState('');
  const [dragOverID,setDragOverID] = useState('');
  
  const lists = state.board.lists.map(listId => state.lists[listId]).filter(Boolean);

  useEffect(() => {
    board.on(BOARD_EVENTS.BOARD_TITLE_UPDATED, (data) => toast.success(`Board title updated to "${data.name}"`));
    board.on(BOARD_EVENTS.LIST_ADDED, (data) => toast.success(`List "${data.name}" added`));
    board.on(BOARD_EVENTS.LIST_TITLE_UPDATED, (data) => toast.success(`List title updated to "${data.name}"`));
    board.on(BOARD_EVENTS.LIST_DELETED, (data) => toast.info(`List deleted`));
    board.on(BOARD_EVENTS.LISTS_REORDERED, (data) => toast.info(`Lists reordered`));
    board.on(BOARD_EVENTS.CARD_ADDED, (data) => toast.success(`Card "${data.title}" added to list`));
    board.on(BOARD_EVENTS.CARD_TITLE_UPDATED, (data) => toast.success(`Card title updated to "${data.title}"`));
    board.on(BOARD_EVENTS.CARD_DELETED, (data) => toast.info(`Card deleted`));
    board.on(BOARD_EVENTS.CARD_MOVED, (data) => {

      toast.info(`Card moved`);
    });
    board.on(BOARD_EVENTS.COMMENT_ADDED, (data) => toast.success(`Comment added to card`));
    board.on(BOARD_EVENTS.CARD_SELECTED_TOGGLED, (data) => toast.info(`Card selection toggled`));
    return () => board.offAll();
  }, []);

  const handleAddList = () => {
    if (newListName.trim()) {
      board.addList(newListName.trim());
      setNewListName('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setNewListName('');
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddList();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    board.setDraggingSource(event.active.id as string);
    setDraggingId(event.active.id as string)
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const domEvent = event.activatorEvent;
    setDraggingId('');
    board.setDragOverID('');

    if (domEvent instanceof MouseEvent) {
      const sourceElement = domEvent.target as HTMLElement;
      if (sourceElement.getAttribute('role') == 'button') return
    }
    if (!over) return;

    if (over.id == active.id) {
      board.editMode(active.id as string, true);
    }
    if (active.data.current?.type === 'list' && board.getListID(active?.id as string) === board.getListID(over?.id as string)) {
      const oldIndex = lists.findIndex(l => l.id === active.id);
      const newIndex = lists.findIndex(l => l.id === over.id);
      const newOrder = arrayMove(lists.map(l => l.id), oldIndex, newIndex);
      board.reorderLists(newOrder);
      updateKey();

    } else if (active.data.current?.type === 'card') {
      const overType = over.data.current?.type;
      const overData = over.data.current;
      if (overType === 'card' && overData) {
        const overListId = overData.listId;
        const overIndex = lists.find(l => l.id === overListId)?.cards.findIndex(c => c === over.id) || 0;
        board.moveCard(active.id as string, overListId, overIndex);
    updateKey();

      }
      else if (overType === 'list' && overData) {
        board.moveCard(active.id as string, over.id as string);
       updateKey();

      }

    }
  };
  const handleDragMove=(event:DragMoveEvent)=>{
    if(event.over?.id){
      setDragOverID(event.over?.id as string);
      board.setDraggingSource(event.active.id as string);
      board.setDragOverID(event.over?.id as string);

    }
  }
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragMove={handleDragMove} >
      <main key={key} className={styles.listContainer}>
        <SortableContext items={lists.map(l => l.id)} strategy={horizontalListSortingStrategy}>
          {lists.map(list => (
            <ListColumn key={list.id} list={list} onCardClick={onCardClick} />
          ))}
        </SortableContext>
        {isAdding ? (
          <div className={styles.list}>
            <input
              className={styles.addListInput}
              placeholder="Enter list title..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className={styles.addListActions}>
              <button className={styles.addBtn} onClick={handleAddList}>
                Add List
              </button>
              <button className={styles.cancelBtn} onClick={handleCancel}>
                ✕
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.addList} onClick={() => setIsAdding(true)}>
            + Add another list
          </div>
        )}
      </main>
      <ToastContainer />
    </DndContext>
  );
};