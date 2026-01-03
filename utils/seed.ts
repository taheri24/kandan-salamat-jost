// utils/seed.ts
import { Board } from '@/contexts/BoardContext';
import { BoardState } from '@/utils/types';
import { v4 } from 'uuid';

export function seedBoard(board: Board) {

  // Clear all state
  const emptyState = {
    board: { id: v4(), name: 'Demo Board', lists: [], revision: 0 },
    lists: {},
    cards: {},
    comments: {},
  } as BoardState;
  board.state = emptyState;

  // Save the empty state
  board.save();

  // Start seeding
  board.addList('To Do');
  board.addList('In Progress');
  board.addList('Done');
  // Get the list IDs
  const lists = board.getState().board.lists;
  const todoId = lists[0];
  const inProgressId = lists[1];
  const doneId = lists[2];

  // Add sample cards
  board.addCard(todoId, 'Plan project');
  board.addCard(todoId, 'Design UI');
  board.addCard(inProgressId, 'Implement dashboard');
  board.addCard(inProgressId, 'Add seed functionality');
  board.addCard(doneId, 'Setup Next.js');
  board.addCard(doneId, 'Initialize codebase');
}