'use client';

import React, { useEffect, useState } from 'react';
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
  const [isEditing, setIsEditing] = useState(card.editing);
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
    board.editMode(card.id,false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitle(card.title);
      setIsEditing(false);
      board.editMode(card.id,false);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      board.deleteCard(card.id);
    }
  };
  const boardState=board.getState();
  const draggingTarget=card.id==boardState.board.dragOverID;
  const emptyPlaceID =`emptyPlace_${card.id}`;
  useEffect(function(){
    if(draggingTarget){
     setTimeout(function(){
      const el=document.getElementById(emptyPlaceID);
      if (el){   
        el?.style.setProperty('height', '70px');
      }
     },10) 
    }
  },[draggingTarget])
  return ( <>
   {false && draggingTarget && boardState.board.draggingSourceID!=boardState.board.dragOverID &&  <section id={emptyPlaceID} className={styles.emptyCard}>
          {board.getDraggingIndicatorText()}

    </section>}
   
    <div ref={setNodeRef} data-card-id={card.id} style={style} className={`${styles.card} ${isDragging ? styles.dragging : ''}`} {...attributes} {...listeners}>
   
      <button role="button" className={styles.deleteCardBtn} onMouseDown={handleDelete}>
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
      ) :<></>}   
         
           <p style={{visibility:isEditing?'hidden':undefined}} className={styles.cardTitle} onDoubleClick={() => {
            //setIsEditing(true)
           }}>
             <span className={styles.cardTitleText}>
                {card.title}
             </span>
            
           </p>
           <footer className={styles.cardFooter}>
               <span role="button" onMouseDown={(e) => { e.stopPropagation();board.editMode(card.id,false);  onClick?.() }} className={styles.commentBadge}>
                 { `Comments(${card.comments.length})`} 
               </span>
              
            </footer>
       
    </div>
    
    </>
  );
};