'use client';

import { Dream } from '@/types';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface DreamCardProps {
  dream: Dream;
}

const Card = styled(Link)`
  display: block;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
  margin: 0;
`;

const DateText = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

const Content = styled.p`
  color: #4b5563;
  margin-bottom: 1rem;
  white-space: pre-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Username = styled.span`
  color: #4b5563;
  font-weight: 500;
`;

const Stats = styled.div`
  display: flex;
  gap: 1rem;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

export function DreamCard({ dream }: DreamCardProps) {
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    setFormattedDate(format(parseISO(dream.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: ja }));
  }, [dream.createdAt]);

  return (
    <Card href={`/dreams/${dream.id}`}>
      <Header>
        <Title>{dream.title}</Title>
        <DateText>{formattedDate}</DateText>
      </Header>
      <Content>{dream.content}</Content>
      {dream.tags && dream.tags.length > 0 && (
        <TagList>
          {dream.tags.map(tag => (
            <Tag key={tag.name}>{tag.name}</Tag>
          ))}
        </TagList>
      )}
      <Footer>
        <UserInfo>
          <Username>{dream.user.username}</Username>
        </UserInfo>
        <Stats>
          <Stat>
            <span>❤️</span>
            <span>{dream._count?.likes || 0}</span>
          </Stat>
          <Stat>
            <span>💭</span>
            <span>{dream._count?.comments || 0}</span>
          </Stat>
        </Stats>
      </Footer>
    </Card>
  );
}
