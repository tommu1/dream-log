'use client';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SortSelect from './SortSelect';

interface SearchFormProps {
  initialQuery?: string;
  initialTag?: string;
  initialSort?: string;
}

const Form = styled.form`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.button<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) => (isSelected ? '#3B82F6' : '#EFF6FF')};
  color: ${({ isSelected }) => (isSelected ? 'white' : '#3B82F6')};
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? '#2563EB' : '#DBEAFE')};
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FormColumn = styled.div`
  flex: 1;
  min-width: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;

  @media (max-width: 640px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`;

export function SearchForm({ initialQuery = '', initialTag = '', initialSort = 'newest' }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [selectedTag, setSelectedTag] = useState(initialTag);
  const [sort, setSort] = useState(initialSort);
  const [popularTags, setPopularTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        const response = await api.get('/tags/popular');
        setPopularTags(response.data.tags.map((tag: any) => tag.name));
      } catch (err) {
        console.error('人気のタグの取得に失敗しました。');
      }
    };

    fetchPopularTags();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (selectedTag) params.set('tag', selectedTag);
    params.set('sort', sort);
    router.push(`/search?${params.toString()}`);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedTag('');
    setSort('newest');
    router.push('/search');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow>
        <FormColumn>
          <Label>キーワード</Label>
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder='キーワードで検索' $fullWidth />
        </FormColumn>
        <FormColumn>
          <Label>並び順</Label>
          <SortSelect value={sort} onChange={value => setSort(value)} />
        </FormColumn>
      </FormRow>

      <FormGroup>
        <Label>人気のタグ</Label>
        <TagList>
          {popularTags.map(tag => (
            <Tag key={tag} isSelected={selectedTag === tag} onClick={() => handleTagClick(tag)} type='button'>
              {tag}
            </Tag>
          ))}
        </TagList>
      </FormGroup>

      <ButtonGroup>
        <Button type='button' $variant='secondary' onClick={handleClear}>
          クリア
        </Button>
        <Button type='submit' $variant='primary'>
          検索
        </Button>
      </ButtonGroup>
    </Form>
  );
}
