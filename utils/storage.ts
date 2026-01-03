'use client'
import { BoardState, Comment } from './types';

const STORAGE_KEY = 'board-state';

export function loadBoardState(): BoardState | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const parsed: BoardState = JSON.parse(stored);
    // Convert timestamp strings back to Date objects
    Object.values(parsed.comments).forEach((comment: Comment & { timestamp: string | Date }) => {
      if (typeof comment.timestamp === 'string') {
        comment.timestamp = new Date(comment.timestamp);
      }
    });
    return parsed;
  } catch (error) {
    console.error('Failed to load board state:', error);
    return null;
  }
}

export function saveBoardState(state: BoardState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save board state:', error);
  }
}