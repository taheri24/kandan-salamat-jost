'use client';

import React from 'react';
import { useBoardState } from '@/contexts/BoardContext';

export const BoardHeader: React.FC = () => {
  const board = useBoardState();
  const state = board.getState();

  return (
    <header className='board-header'>
      <h1>{state.board.name}</h1>
    </header>
  );
};