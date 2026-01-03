// utils/seed.ts
import { Board } from '@/contexts/BoardContext';

export function seedBoard(board: Board) {
  // Clear existing data if any
  const state = board.getState();
  if (state.board.lists.length > 0) {
    // Optionally clear, but for now, add if empty
    return;
  }

  // Add sample lists
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