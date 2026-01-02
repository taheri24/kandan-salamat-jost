import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Board } from '../BoardContext';
import { BoardState } from '@/utils/types';

describe('Board Class', () => {
  let mockOnSave: (state: BoardState) => void;
  let board: Board;

  beforeEach(() => {
    mockOnSave = vi.fn();
    board = new Board(null, mockOnSave);
  });

  it('should initialize with default state', () => {
    const state = board.getState();
    expect(state.board.name).toBe('My Board');
    expect(state.board.lists).toEqual([]);
    expect(Object.keys(state.lists)).toHaveLength(0);
  });

  it('should update board title', () => {
    board.updateBoardTitle('New Title');
    expect(board.getState().board.name).toBe('New Title');
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('should add a list', () => {
    board.addList('Test List');
    const state = board.getState();
    expect(state.board.lists).toHaveLength(1);
    const listId = state.board.lists[0];
    expect(state.lists[listId].name).toBe('Test List');
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('should update list title', () => {
    board.addList('Old Name');
    const listId = board.getState().board.lists[0];
    board.updateListTitle(listId, 'New Name');
    expect(board.getState().lists[listId].name).toBe('New Name');
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('should delete a list', () => {
    board.addList('List to Delete');
    const listId = board.getState().board.lists[0];
    board.deleteList(listId);
    expect(board.getState().board.lists).toHaveLength(0);
    expect(board.getState().lists[listId]).toBeUndefined();
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('should add a card', () => {
    board.addList('List');
    const listId = board.getState().board.lists[0];
    board.addCard(listId, 'Test Card');
    const state = board.getState();
    expect(state.lists[listId].cards).toHaveLength(1);
    const cardId = state.lists[listId].cards[0];
    expect(state.cards[cardId].title).toBe('Test Card');
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('should update card title', () => {
    board.addList('List');
    const listId = board.getState().board.lists[0];
    board.addCard(listId, 'Old Title');
    const cardId = board.getState().lists[listId].cards[0];
    board.updateCardTitle(cardId, 'New Title');
    expect(board.getState().cards[cardId].title).toBe('New Title');
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('should delete a card', () => {
    board.addList('List');
    const listId = board.getState().board.lists[0];
    board.addCard(listId, 'Card');
    const cardId = board.getState().lists[listId].cards[0];
    board.deleteCard(cardId);
    expect(board.getState().lists[listId].cards).toHaveLength(0);
    expect(board.getState().cards[cardId]).toBeUndefined();
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('should move a card', () => {
    board.addList('List1');
    board.addList('List2');
    const listIds = board.getState().board.lists;
    board.addCard(listIds[0], 'Card');
    const cardId = board.getState().lists[listIds[0]].cards[0];
    board.moveCard(cardId, listIds[1]);
    expect(board.getState().lists[listIds[0]].cards).toHaveLength(0);
    expect(board.getState().lists[listIds[1]].cards).toEqual([cardId]);
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('should add a comment', () => {
    board.addList('List');
    const listId = board.getState().board.lists[0];
    board.addCard(listId, 'Card');
    const cardId = board.getState().lists[listId].cards[0];
    board.addComment(cardId, 'Test comment', 'Author');
    const state = board.getState();
    expect(state.cards[cardId].comments).toHaveLength(1);
    const commentId = state.cards[cardId].comments[0];
    expect(state.comments[commentId].text).toBe('Test comment');
    expect(state.comments[commentId].author).toBe('Author');
    expect(mockOnSave).toHaveBeenCalled();
  });

  it('should reorder lists', () => {
    board.addList('List1');
    board.addList('List2');
    const originalOrder = board.getState().board.lists;
    const newOrder = [originalOrder[1], originalOrder[0]];
    board.reorderLists(newOrder);
    expect(board.getState().board.lists).toEqual(newOrder);
    expect(mockOnSave).toHaveBeenCalled();
  });
});