'use client';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { createDream, updateDream } from '@/store/slices/dreamSlice';
import { Dream } from '@/types';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

interface DreamFormProps {
  dream?: Dream;
  onClose?: () => void;
}

const Form = styled.form`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  color: #1f2937;
  resize: vertical;
  min-height: 8rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TagInput = styled(Input)`
  margin-bottom: 0.5rem;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  line-height: 1;

  &:hover {
    color: #ef4444;
  }
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

export function DreamForm({ dream, onClose }: DreamFormProps) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(dream?.title || '');
  const [content, setContent] = useState(dream?.content || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(dream?.tags?.map(tag => tag.name) || []);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (dream) {
        await dispatch(
          updateDream({
            id: dream.id,
            title,
            content,
            tags,
            isPublic: dream.isPublic
          })
        ).unwrap();
        onClose?.();
      } else {
        await dispatch(
          createDream({
            title,
            content,
            tags,
            isPublic: true
          })
        ).unwrap();
        setTitle('');
        setContent('');
        setTags([]);
        setTagInput('');
      }
    } catch (err: any) {
      setError(err.message || (dream ? '夢の更新に失敗しました' : '夢の投稿に失敗しました'));
    } finally {
      setLoading(false);
    }
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor='title'>タイトル</Label>
        <Input id='title' type='text' value={title} onChange={e => setTitle(e.target.value)} required $fullWidth />
      </FormGroup>
      <FormGroup>
        <Label htmlFor='content'>内容</Label>
        <TextArea id='content' value={content} onChange={e => setContent(e.target.value)} required />
      </FormGroup>
      <FormGroup>
        <Label htmlFor='tags'>タグ</Label>
        <TagInput
          id='tags'
          type='text'
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyPress={handleTagInputKeyPress}
          placeholder='Enterで追加'
          $fullWidth
        />
        <TagList>
          {tags.map(tag => (
            <Tag key={tag}>
              {tag}
              <RemoveTagButton type='button' onClick={() => removeTag(tag)}>
                ×
              </RemoveTagButton>
            </Tag>
          ))}
        </TagList>
      </FormGroup>
      {error && <ErrorText>{error}</ErrorText>}
      <ButtonGroup>
        {onClose && (
          <Button type='button' $variant='secondary' onClick={onClose}>
            キャンセル
          </Button>
        )}
        <Button type='submit' $variant='primary' $loading={loading}>
          {dream ? '更新する' : '投稿する'}
        </Button>
      </ButtonGroup>
    </Form>
  );
}
