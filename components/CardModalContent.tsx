'use client';

import React, { useState, useEffect } from 'react';
import { useBoardState } from '@/contexts/BoardContext';
import { Card as CardType, Comment } from '@/utils/types';
import styles from '@/styles/CardModalContent.module.scss';

interface CardModalContentProps {
  cardId: string;
  onClose: () => void;
}

export const CardModalContent: React.FC<CardModalContentProps> = ({ cardId, onClose }) => {
  const board = useBoardState();
  const state = board.getState();
  const card = state.cards[cardId];
  const comments = card.comments.map(commentId => state.comments[commentId]).filter(Boolean);
  const [title, setTitle] = useState(card.title);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleTitleSubmit = () => {
    if (title.trim()) {
      board.updateCardTitle(cardId, title.trim());
    } else {
      setTitle(card.title);
    }
    setIsEditingTitle(false);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      board.addComment(cardId, newComment.trim());
      setNewComment('');
    }
  };

  const handleDelete = () => {
    board.deleteCard(cardId);
    onClose();
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
            <span onClick={() => setIsEditingTitle(true)}>{card.title}</span>
          )}
        </h2>
        <button className={styles.deleteButton} onClick={handleDelete}>Delete</button>
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
          <button onClick={handleAddComment}>Save</button>
        </div>
      </div>
    </div>
  );
};