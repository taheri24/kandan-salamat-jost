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
  const [isEditing, setIsEditing] = useState(false);
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
  } = useSortable({
    id: list.id,
    data: { type: 'list' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTitleSubmit = () => {
    if (title.trim()) {
      board.updateListTitle(list.id, title.trim());
    } else {
      setTitle(list.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(list.name);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    board.deleteList(list.id);
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

  return (
    <div ref={setNodeRef} style={style} className={styles.list}>
      <div className={styles.listHeader} {...attributes} {...listeners}>
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
          <h3 className={styles.listTitle} onClick={() => setIsEditing(true)}>
            {list.name}
          </h3>
        )}
        <button className={styles.deleteListBtn} onClick={handleDelete}>
          ×
        </button>
      </div>
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className={styles.cards}>
          {cards.map(card => (
            <CardItem key={card.id} card={card} listId={list.id} onClick={() => onCardClick?.(card.id)} />
          ))}
        </div>
      </SortableContext>
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
        <div className={styles.addCard} onClick={() => setIsAddingCard(true)}>
          + Add another card
        </div>
      )}
    </div>
  );
};