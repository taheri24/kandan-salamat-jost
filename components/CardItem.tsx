'use client';

import React, { useState } from 'react';
import { useBoardState } from '@/contexts/BoardContext';
import { Card as CardType } from '@/utils/types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from '@/styles/CardItem.module.scss';

interface CardItemProps {
  card: CardType;
  listId: string;
  onClick?: () => void;
}

export const CardItem: React.FC<CardItemProps> = ({ card, listId, onClick }) => {
  const board = useBoardState();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: card.id,
    data: { type: 'card', listId },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTitleSubmit = () => {
    if (title.trim()) {
      board.updateCardTitle(card.id, title.trim());
    } else {
      setTitle(card.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(card.title);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    board.deleteCard(card.id);
  };

  return (
    <div ref={setNodeRef} style={style} className={styles.card} {...attributes} {...listeners}>
      <button className={styles.deleteCardBtn} onClick={handleDelete}>
        ×
      </button>
      {isEditing ? (
        <input
          className={styles.cardTitleInput}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <p className={styles.cardTitle} onClick={(e) => { e.stopPropagation(); onClick?.(); }} onDoubleClick={() => setIsEditing(true)}>
          {card.title}
        </p>
      )}
    </div>
  );
};