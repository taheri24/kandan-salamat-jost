'use client';

import React from 'react';
import { useBoardState } from '@/contexts/BoardContext';
import { List } from '@/utils/types';

interface BoardHeaderProps {
  lists: List[];
  onListSelect: (listId: string) => void;
}

export default function BoardHeader({ lists, onListSelect }:BoardHeaderProps) {
  const board = useBoardState();
  const state = board.getState();

  return (
    <header className='board-header'>
      <h1>{state.board.name}</h1>
      <select className="list-select" onChange={(e) => onListSelect(e.target.value)} defaultValue="">
        <option value="">Select a list</option>
        {lists.map(list => (
          <option key={list.id} value={list.id}>{list.name}</option>
        ))}
      </select>
    </header>
  );
};