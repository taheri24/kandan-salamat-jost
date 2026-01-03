'use client';

import React, { useState } from 'react';
import { FaEdit, FaComment } from 'react-icons/fa';
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
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
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
    <div ref={setNodeRef} style={style} className={`${styles.card} ${isDragging ? styles.dragging : ''}`} {...attributes} {...listeners}>
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
        <>
           <p className={styles.cardTitle} onDoubleClick={() => setIsEditing(true)}>
             <span className={styles.cardTitleText}>
               {card.title}
             </span>
             {card.comments.length > 0 && (
               <span className={styles.commentBadge}>
                 <FaComment /> {card.comments.length}
               </span>
             )}
             <button onMouseUp={(e) => { e.stopPropagation(); onClick?.() }} className={styles.editIcon}>
               <FaEdit />
             </button>
           </p>
            
        </>
      )}
    </div>
  );
};