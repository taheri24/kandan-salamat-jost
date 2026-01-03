'use client';

import { useState } from 'react';
import { BoardHeader } from '@/components/BoardHeader';
import { Modal } from '@/components/Modal';
import { CardModalContent } from '@/components/CardModalContent';
import dynamic  from 'next/dynamic';
const ListContainer=dynamic(()=>import('@/components/ListContainer'),{ssr:false})
export default function BoardPage() {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleCardClick = (cardId: string) => {
    setSelectedCardId(cardId);
  };

  const handleCloseModal = () => {
    setSelectedCardId(null);
  };

  return (
    <div className='board-page' suppressHydrationWarning>
      <BoardHeader />
      <ListContainer onCardClick={handleCardClick} />
      <Modal isOpen={!!selectedCardId} onClose={handleCloseModal}>
        {selectedCardId && <CardModalContent cardId={selectedCardId} onClose={handleCloseModal} />}
      </Modal>
    </div>
  );
}