"use client"
'use client';

import React, { useState } from 'react';
import { useBoardState } from '@/contexts/BoardContext';
import { ListColumn } from './ListColumn';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import styles from '@/styles/ListContainer.module.scss';

interface ListContainerProps {
  onCardClick?: (cardId: string) => void;
}

export const ListContainer: React.FC<ListContainerProps> = ({ onCardClick }) => {
  const board = useBoardState();
  const [isAdding, setIsAdding] = useState(false);
  const [newListName, setNewListName] = useState('');
  const state = board.getState();
  const lists = state.board.lists.map(listId => state.lists[listId]).filter(Boolean);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.data.current?.type === 'list') {
      const oldIndex = lists.findIndex(l => l.id === active.id);
      const newIndex = lists.findIndex(l => l.id === over.id);
      const newOrder = arrayMove(lists.map(l => l.id), oldIndex, newIndex);
      board.reorderLists(newOrder);
    } else if (active.data.current?.type === 'card') {
      const overType = over.data.current?.type;
      const overData = over.data.current;
      if (overType === 'card' && overData) {
        const overListId = overData.listId;
        const overIndex = lists.find(l => l.id === overListId)?.cards.findIndex(c => c === over.id) || 0;
        board.moveCard(active.id as string, overListId, overIndex);
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className={styles.listContainer}>
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
      </div>
    </DndContext>
  );
};