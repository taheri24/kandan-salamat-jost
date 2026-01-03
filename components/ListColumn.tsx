"use client"
import React from 'react';
import { useState } from 'react';
import { useBoardState } from '@/contexts/BoardContext';
import { List as ListType } from '@/utils/types';
import { CardItem } from './CardItem';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import styles from '@/styles/ListColumn.module.scss';

interface ListColumnProps {
  list: ListType;
  onCardClick?: (cardId: string) => void;
}

export const ListColumn: React.FC<ListColumnProps> = ({ list, onCardClick }) => {
  const board = useBoardState();
  const [isEditing, setIsEditing] = useState(list.editing);
  const [title, setTitle] = useState(list.name);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const cards = list.cards.map(cardId => board.getState().cards[cardId]).filter(Boolean);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef
  } = useSortable({
    id: list.id,
    data: { type: 'list' },
  });


  const handleTitleSubmit = () => {
    if (title.trim()) {
      board.updateListTitle(list.id, title.trim());
    } else {
      setTitle(list.name);
    }
    setIsEditing(false);
    board.editMode(list.id, false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(list.name);
      setIsEditing(false);
      board.editMode(list.id, false);

    }
  };

  const handleDelete = () => {
    board.editMode(list.id, false);
    if (window.confirm('Are you sure you want to delete this list?')) {
      board.deleteList(list.id);
    }
    board.editMode(list.id, false);

  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      board.addCard(list.id, newCardTitle.trim());
      setNewCardTitle('');
      setIsAddingCard(false);
    }
  };

  const handleCancelCard = () => {
    setNewCardTitle('');
    setIsAddingCard(false);
  };

  const handleCardKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCard();
    } else if (e.key === 'Escape') {
      handleCancelCard();
    }
  };
  
  const boardState = board.getState();
  const draggingTarget = list.id == boardState.dragOverID;
  const emptyPlaceID = `emptyPlace_${list.id}`;
  React.useEffect(function () {
    if (draggingTarget) {
      setTimeout(function () {
        const el = document.getElementById(emptyPlaceID);
        if (el) {
          el?.style.setProperty('height', '60px');
        }
      }, 10)
    }
  }, [draggingTarget])
   const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} id={list.id} className={`${styles.list} ${isDragging ? styles.dragging : ''}`}  >
      <div  className={styles.listHeader} >
        {isEditing ? (
          <input
            className={styles.listTitleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <h3 {...listeners} {...attributes}  ref={setActivatorNodeRef} role="editCaption" className={styles.listTitle} onClick={() => setIsEditing(true)}>
            {list.name}
          </h3>
        )}
        <button onMouseUp={handleDelete}  className={styles.deleteListBtn} role="button">
          ×
        </button>
      </div>
      <div className={styles.cards}  >
       
<div>
  
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        {cards.map(card => (
          <CardItem key={card.id} card={card} listId={list.id} onClick={() => onCardClick?.(card.id)} />
        ))}
     </SortableContext>   
     </div>   
                </div>
      {isAddingCard ? (
        <div>
          <input
            className={styles.addCardInput}
            placeholder="Enter card title..."
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={handleCardKeyDown}
            autoFocus
          />
          <div className={styles.addCardActions}>
            <button className={styles.addBtn} onClick={handleAddCard}>
              Add Card
            </button>
            <button className={styles.cancelBtn} onClick={handleCancelCard}>
              ✕
            </button>
          </div>
        </div>
      ) : (
        <div role="button" data-role="button" className={styles.addCard} onMouseUp={(e =>{  e.stopPropagation();e.preventDefault(); setIsAddingCard(true) })}>
          + Add another card
        </div>
      )}
    </div>
  );
};