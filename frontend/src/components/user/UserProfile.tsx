import Button from '@/components/common/Button';
import { User } from '@/types';
import api from '@/utils/api';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import styled from 'styled-components';

interface UserProfileProps {
  user: User;
  isCurrentUser: boolean;
}

const Container = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f3f4f6;
`;

const DefaultAvatar = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e5e7eb;
  color: #9ca3af;
  font-size: 2rem;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Username = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const DisplayName = styled.p`
  color: #4b5563;
  margin-bottom: 1rem;
`;

const Bio = styled.p`
  color: #6b7280;
  white-space: pre-wrap;
`;

const Stats = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

const UserProfile: React.FC<UserProfileProps> = ({ user, isCurrentUser }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await api.delete(`/users/${user.id}/follow`);
        setFollowersCount(prev => prev - 1);
      } else {
        await api.post(`/users/${user.id}/follow`);
        setFollowersCount(prev => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('フォロー操作に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <ProfileHeader>
        <AvatarContainer>
          {user.profile?.avatarUrl ? (
            <Image src={user.profile.avatarUrl} alt={user.username} layout='fill' objectFit='cover' />
          ) : (
            <DefaultAvatar>{user.username.charAt(0).toUpperCase()}</DefaultAvatar>
          )}
        </AvatarContainer>

        <ProfileInfo>
          <Username>{user.username}</Username>
          {user.profile?.displayName && <DisplayName>{user.profile.displayName}</DisplayName>}
          <Stats>
            <StatItem>
              <StatValue>{followersCount}</StatValue>
              <StatLabel>フォロワー</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{followingCount}</StatValue>
              <StatLabel>フォロー中</StatLabel>
            </StatItem>
          </Stats>
          <Actions>
            {isCurrentUser ? (
              <Link href='/profile' passHref>
                <Button variant='outline'>プロフィールを編集</Button>
              </Link>
            ) : (
              <Button variant={isFollowing ? 'secondary' : 'primary'} onClick={handleFollow} isLoading={isLoading}>
                {isFollowing ? 'フォロー解除' : 'フォローする'}
              </Button>
            )}
          </Actions>
        </ProfileInfo>
      </ProfileHeader>

      {user.profile?.bio && <Bio>{user.profile.bio}</Bio>}
    </Container>
  );
};

export default UserProfile;
