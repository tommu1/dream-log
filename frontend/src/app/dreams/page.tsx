'use client';

import { DreamForm } from '@/components/dream/DreamForm';
import { DreamList } from '@/components/dream/DreamList';
import { RootState } from '@/store';
import { getDreams } from '@/store/slices/dreamSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 2rem;
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: #6b7280;
  margin: 2rem 0;
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: #ef4444;
  margin: 2rem 0;
`;

export default function DreamsPage() {
  const dispatch = useDispatch();
  const dreamState = useSelector((state: RootState) => state.dream);
  const { dreams, loading, error } = dreamState || { dreams: [], loading: false, error: null };

  useEffect(() => {
    dispatch(getDreams());
  }, [dispatch]);

  if (loading) {
    return <LoadingMessage>読み込み中...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Title>タイムライン</Title>
      <DreamForm />
      <DreamList dreams={dreams} />
    </Container>
  );
}
