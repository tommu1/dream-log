'use client';

import { Dream } from '@/types';
import styled from 'styled-components';
import { DreamCard } from './DreamCard';

interface DreamListProps {
  dreams: Dream[];
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const EmptyMessage = styled.p`
  text-align: center;
  color: #6b7280;
  margin: 2rem 0;
`;

export function DreamList({ dreams }: DreamListProps) {
  if (!dreams || dreams.length === 0) {
    return <EmptyMessage>まだ夢の記録がありません</EmptyMessage>;
  }

  return (
    <List>
      {dreams.map(dream => (
        <DreamCard key={dream.id} dream={dream} />
      ))}
    </List>
  );
}
