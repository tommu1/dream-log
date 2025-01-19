'use client';

import { CommentSection } from '@/components/dream/CommentSection';
import { DreamDetail } from '@/components/dream/DreamDetail';
import { RootState } from '@/store';
import { getDream } from '@/store/slices/dreamSlice';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: transparent;
  min-height: calc(100vh - 4rem);

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: #6b7280;
  margin: 2rem 0;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: #ef4444;
  margin: 2rem 0;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export default function DreamPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const dreamState = useSelector((state: RootState) => state.dream);
  const { currentDream, loading, error } = dreamState || { currentDream: null, loading: false, error: null };

  useEffect(() => {
    if (params.id) {
      dispatch(getDream(params.id as string));
    }
  }, [dispatch, params.id]);

  if (loading) {
    return <LoadingMessage>読み込み中...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!currentDream) {
    return <ErrorMessage>夢が見つかりません。</ErrorMessage>;
  }

  return (
    <Container>
      <DreamDetail dream={currentDream} />
      <CommentSection dreamId={currentDream.id} />
    </Container>
  );
}
