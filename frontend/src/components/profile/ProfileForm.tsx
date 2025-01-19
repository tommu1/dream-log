import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { setCredentials } from '@/store/slices/authSlice';
import { User } from '@/types';
import api from '@/utils/api';
import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import AvatarUpload from './AvatarUpload';

interface ProfileFormProps {
  user: User;
  onCancel: () => void;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.625rem;
  border-radius: 0.375rem;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  min-height: 100px;
  resize: vertical;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ProfileForm: React.FC<ProfileFormProps> = ({ user, onCancel }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    displayName: user.profile?.displayName || '',
    bio: user.profile?.bio || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await api.post(`/users/${user.id}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch(
        setCredentials({
          user: response.data.user,
          token: Cookies.get('token') || ''
        })
      );
    } catch (err) {
      throw new Error('アバターのアップロードに失敗しました。');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.put(`/users/${user.id}`, formData);
      dispatch(
        setCredentials({
          user: response.data.user,
          token: Cookies.get('token') || ''
        })
      );
      onCancel();
    } catch (err) {
      setError('プロフィールの更新に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <AvatarUpload currentAvatarUrl={user.profile?.avatarUrl} onUpload={handleAvatarUpload} />

      <Input label='ユーザー名' name='username' value={formData.username} onChange={handleChange} required />
      <Input label='メールアドレス' type='email' name='email' value={formData.email} onChange={handleChange} required />
      <Input label='表示名' name='displayName' value={formData.displayName} onChange={handleChange} />
      <div>
        <label htmlFor='bio' className='block text-sm font-medium text-gray-700 mb-1'>
          自己紹介
        </label>
        <TextArea id='bio' name='bio' value={formData.bio} onChange={handleChange} />
      </div>

      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <ButtonGroup>
        <Button type='button' variant='secondary' onClick={onCancel}>
          キャンセル
        </Button>
        <Button type='submit' isLoading={isLoading}>
          保存
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default ProfileForm;
