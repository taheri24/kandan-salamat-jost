'use client';

import { useState } from 'react';
import { useBoardState } from '@/contexts/BoardContext';
import { Modal } from '@/components/Modal';
import { CardModalContent } from '@/components/CardModalContent';
import dynamic  from 'next/dynamic';
const ListContainer=dynamic(()=>import('@/components/ListContainer'),{ssr:false})
const BoardHeader= dynamic(()=>import('@/components/BoardHeader'),{ssr:false})
export default function BoardPage() {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const board = useBoardState();
  const state = board.getState();
  const lists = state.board.lists.map(listId => state.lists[listId]).filter(Boolean);

  const handleCardClick = (cardId: string) => {
    setSelectedCardId(cardId);
  };

  const handleCloseModal = () => {
    setSelectedCardId(null);
  };

  const handleListSelect = (listId: string) => {
    if (listId) {
      document.getElementById(listId)?.scrollIntoView({ behavior: 'smooth' });
      document.scrollingElement?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className='board-page' suppressHydrationWarning>
      <BoardHeader lists={lists} onListSelect={handleListSelect} />
      <ListContainer onCardClick={handleCardClick} />
      <Modal isOpen={!!selectedCardId} onClose={handleCloseModal}>
         <CardModalContent cardId={selectedCardId || undefined} onClose={handleCloseModal} />
      </Modal>
      
    </div>
  );
}