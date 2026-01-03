'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useBoardState } from '@/contexts/BoardContext';
import { Card as CardType, Comment } from '@/utils/types';
import styles from '@/styles/CardModalContent.module.scss';

interface CardModalContentProps {
  cardId?: string;
  onClose: () => void;
}

export const CardModalContent: React.FC<CardModalContentProps> = ({ cardId, onClose }) => {
  const board = useBoardState();
  const state = board.getState();
  const card = cardId ? state.cards[cardId]: undefined;
  const comments = card?.comments.map(commentId => state.comments[commentId]).filter(Boolean) || [];
  const [title, setTitle] = useState(card?.title || ''  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newComment, setNewComment] = useState('');
  const openTimeRef = useRef(+new Date());

  const handleClose = useCallback(() => {
    const now = +new Date();
    if (now - openTimeRef.current < 400) return;
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        openTimeRef.current= 0;
        handleClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  const handleTitleSubmit = () => {
    if(!cardId || !card) return;
    if (title.trim() ) {
      board.updateCardTitle(cardId, title.trim());
    } else {
      setTitle(card.title);
    }
    setIsEditingTitle(false);
  };

  const handleAddComment = () => {
    if(!cardId || !card) return;
    if (newComment.trim()) {
      board.addComment(cardId, newComment.trim());
      setNewComment('');
    }
  };

  const handleDelete = () => {
    if(!cardId || !card) return;
    board.deleteCard(cardId);
    handleClose();
  };

  return (
    <div className={styles.content}>
      <div className={styles.header}>
        <h2>
          {isEditingTitle ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
            />
          ) : (
            <span role="button" onClick={() => setIsEditingTitle(true)}>{card?.title}</span>
          )}
        </h2>
      </div>
      <div className={styles.comments}>
        <h3>Comments</h3>
        {comments.map(comment => (
          <div key={comment.id} className={styles.comment}>
            <p>{comment.text}</p>
            <small>{comment.author || 'Anonymous'} - {comment.timestamp.toLocaleString()}</small>
          </div>
        ))}
        <div className={styles.addComment}>
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <button className={styles.addCommentBtn} onClick={handleAddComment}>Add Comment</button>
        <span style={{flex:1}}></span>
        <button className={styles.deleteButton} onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};