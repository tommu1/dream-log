'use client';

import { RootState } from '@/store';
import { getCurrentUser } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
`;

const ProfileInfo = styled.div`
  margin-bottom: 2rem;
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.span`
  font-weight: 500;
  color: #4b5563;
  margin-right: 0.5rem;
`;

const Value = styled.span`
  color: #1f2937;
`;

const LoadingMessage = styled.p`
  text-align: center;
  color: #6b7280;
  margin: 2rem 0;
`;

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
      return;
    }

    // ユーザー名が利用可能になるまで待機
    if (user.username) {
      console.log('Redirecting to user profile:', user.username);
      router.push(`/users/${encodeURIComponent(user.username)}`);
    }
  }, [user, router, dispatch]);

  if (loading) {
    return <LoadingMessage>読み込み中...</LoadingMessage>;
  }

  if (!user) {
    return <LoadingMessage>ログインが必要です</LoadingMessage>;
  }

  return <LoadingMessage>リダイレクト中...</LoadingMessage>;
}
