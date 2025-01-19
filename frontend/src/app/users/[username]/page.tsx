'use client';

import { DreamList } from '@/components/dream/DreamList';
import { RootState } from '@/store';
import { Dream, User } from '@/types';
import { api } from '@/utils/api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 768px;
  margin: 0 auto;
  padding: 2rem;
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

const UserInfo = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const Username = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 1rem;
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

export default function UserPage() {
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!params?.username) {
      setError('ユーザー名が指定されていません');
      setLoading(false);
      return;
    }

    const username = decodeURIComponent(params.username as string);

    const fetchUserData = async () => {
      try {
        const [userResponse, dreamsResponse] = await Promise.all([
          api.get<{ user: User }>(`/users/${username}`),
          api.get<{ dreams: Dream[] }>(`/users/${username}/dreams`)
        ]);

        setUser(userResponse.data.user);
        setDreams(dreamsResponse.data.dreams);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || 'ユーザー情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [params?.username]);

  if (loading) {
    return <LoadingMessage>読み込み中...</LoadingMessage>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!user) {
    return <ErrorMessage>ユーザーが見つかりません</ErrorMessage>;
  }

  return (
    <Container>
      <UserInfo>
        <Username>{user.username}</Username>
        <Stats>
          <StatItem>
            <StatValue>{user.dreamCount || 0}</StatValue>
            <StatLabel>夢</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{user.followerCount || 0}</StatValue>
            <StatLabel>フォロワー</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{user.followingCount || 0}</StatValue>
            <StatLabel>フォロー中</StatLabel>
          </StatItem>
        </Stats>
      </UserInfo>
      <DreamList dreams={dreams} />
    </Container>
  );
}
