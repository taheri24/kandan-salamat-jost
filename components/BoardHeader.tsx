'use client';

import React, { useState, useEffect } from 'react';
import { useBoardState } from '@/contexts/BoardContext';
import { List } from '@/utils/types';
import { seedBoard } from '@/utils/seed';

interface BoardHeaderProps {
  lists: List[];
  onListSelect: (listId: string) => void;
}

export default function BoardHeader({ lists, onListSelect }:BoardHeaderProps) {
  const board = useBoardState();
  const state = board.getState();
  const [isSeeded, setIsSeeded] = useState(false);

  useEffect(() => {
    document.title = state.board.name;
  }, [state.board.name]);

  return (
    <header className='board-header'>
      <h1>{state.board.name}</h1>
      <select className="list-select" onChange={(e) => onListSelect(e.target.value)} defaultValue="">
        <option value="">Select a list</option>
        {lists.map(list => (
          <option key={list.id} value={list.id}>{list.name}</option>
        ))}
      </select>
      <button className={`seed-button ${isSeeded ? 'seeded' : ''}`} onClick={() => {
        const before = state.board.lists.length;
         
        seedBoard(board);
        board.UiPatcherFn?.();
        const after = board.getState().board.lists.length;
        if (after > before) {
          setIsSeeded(true);
          setTimeout(() => setIsSeeded(false), 1000); // Reset after animation
        }
      }}>Seed Board</button>
    </header>
  );
};