'use client';

import { Button } from '@/components/common/Button';
import { RootState } from '@/store';
import { updateDream } from '@/store/slices/dreamSlice';
import { Dream } from '@/types';
import { api } from '@/utils/api';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { DreamForm } from './DreamForm';

interface DreamDetailProps {
  dream: Dream;
}

const Container = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto 2rem;

  @media (max-width: 640px) {
    padding: 1.5rem;
    margin: 0 1rem 2rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
  width: 100%;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  flex-wrap: wrap;
`;

const Content = styled.div`
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
  word-break: break-word;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Tag = styled.span`
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  white-space: nowrap;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const LikeButton = styled(Button)<{ $isLiked: boolean }>`
  color: ${props => (props.$isLiked ? '#ef4444' : '#6b7280')};
  background-color: ${props => (props.$isLiked ? '#fecaca' : '#f3f4f6')};

  &:hover {
    background-color: ${props => (props.$isLiked ? '#fca5a5' : '#e5e7eb')};
  }

  span {
    color: white;
    background-color: ${props => (props.$isLiked ? '#ef4444' : '#9ca3af')};
    padding: 0.125rem 0.375rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    margin-left: 0.25rem;
  }
`;

export function DreamDetail({ dream }: DreamDetailProps) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLike = async () => {
    try {
      await api.post(`/dreams/${dream.id}/like`);
      setIsLiked(!isLiked);
      const response = await api.get(`/dreams/${dream.id}`);
      dispatch(updateDream(response.data.dream));
    } catch (err) {
      console.error('いいねの更新に失敗しました');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('この夢を削除してもよろしいですか？')) {
      try {
        await api.delete(`/dreams/${dream.id}`);
        window.location.href = '/dreams';
      } catch (err) {
        console.error('夢の削除に失敗しました');
      }
    }
  };

  if (isEditing) {
    return <DreamForm dream={dream} onClose={() => setIsEditing(false)} />;
  }

  return (
    <Container>
      <Header>
        <div>
          <Title>{dream.title}</Title>
          <Meta>
            <span>
              {format(parseISO(dream.createdAt), 'yyyy年MM月dd日 HH:mm', {
                locale: ja
              })}
            </span>
            {dream.user && <span>by {dream.user.username}</span>}
          </Meta>
        </div>
        {user?.id === dream.userId && (
          <div>
            <Button $variant='outline' onClick={() => setIsEditing(true)}>
              編集
            </Button>
            <Button $variant='secondary' onClick={handleDelete} style={{ marginLeft: '0.5rem' }}>
              削除
            </Button>
          </div>
        )}
      </Header>

      <Content>{dream.content}</Content>

      {dream.tags && dream.tags.length > 0 && (
        <TagList>
          {dream.tags.map(tag => (
            <Tag key={tag.name}>{tag.name}</Tag>
          ))}
        </TagList>
      )}

      <Actions>
        <LikeButton $variant='outline' $isLiked={isLiked} onClick={handleLike}>
          {isLiked ? '❤️' : '🤍'} <span>{dream._count?.likes || 0}</span>
        </LikeButton>
      </Actions>
    </Container>
  );
}
