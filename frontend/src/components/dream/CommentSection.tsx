'use client';

import { Button } from '@/components/common/Button';
import { RootState } from '@/store';
import { api } from '@/utils/api';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
}

interface CommentSectionProps {
  dreamId: string;
}

const Container = styled.div`
  margin-top: 2rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const CommentForm = styled.form`
  margin-bottom: 2rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #1f2937;
  resize: vertical;
  min-height: 6rem;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const CommentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentItem = styled.div`
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CommentAuthor = styled.span`
  font-weight: 500;
  color: #4b5563;
`;

const CommentDate = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const CommentContent = styled.p`
  color: #4b5563;
  white-space: pre-wrap;
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

export function CommentSection({ dreamId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchComments = async () => {
    try {
      const response = await api.get(`/dreams/${dreamId}/comments`);
      setComments(response.data.comments);
    } catch (err) {
      console.error('コメントの取得に失敗しました:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [dreamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await api.post(`/dreams/${dreamId}/comments`, { content });
      setContent('');
      fetchComments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'コメントの投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>コメント</Title>
      {user && (
        <CommentForm onSubmit={handleSubmit}>
          <TextArea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder='コメントを入力...'
            required
          />
          {error && <ErrorText>{error}</ErrorText>}
          <Button type='submit' $variant='primary' $loading={loading}>
            コメントを投稿
          </Button>
        </CommentForm>
      )}
      <CommentList>
        {comments.map(comment => (
          <CommentItem key={comment.id}>
            <CommentHeader>
              <CommentAuthor>{comment.user.displayName || comment.user.username}</CommentAuthor>
              <CommentDate>
                {new Date(comment.createdAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </CommentDate>
            </CommentHeader>
            <CommentContent>{comment.content}</CommentContent>
          </CommentItem>
        ))}
      </CommentList>
    </Container>
  );
}
