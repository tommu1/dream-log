'use client';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { AppDispatch } from '@/store';
import { register } from '@/store/slices/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
`;

const Form = styled.form`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  text-align: center;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: #6b7280;

  a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません。');
      return false;
    }
    if (formData.password.length < 8) {
      setError('パスワードは8文字以上で入力してください。');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      await dispatch(
        register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      ).unwrap();
      router.push('/dreams');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.status === 400) {
        setError('入力内容が正しくありません。');
      } else if (err.status === 409) {
        setError('このユーザー名またはメールアドレスは既に使用されています。');
      } else {
        setError('新規登録に失敗しました。もう一度お試しください。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>新規登録</Title>

        <FormGroup>
          <Input placeholder='ユーザー名' name='username' value={formData.username} onChange={handleChange} required />
        </FormGroup>

        <FormGroup>
          <Input
            placeholder='メールアドレス'
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Input
            placeholder='パスワード'
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </FormGroup>

        <FormGroup>
          <Input
            placeholder='パスワード（確認）'
            type='password'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
        </FormGroup>

        {error && <p className='text-red-500 text-sm text-center mb-4'>{error}</p>}

        <Button type='submit' $loading={isLoading} style={{ width: '100%' }}>
          登録する
        </Button>

        <LoginLink>
          すでにアカウントをお持ちの方は <Link href='/login'>ログイン</Link>
        </LoginLink>
      </Form>
    </Container>
  );
};

export default RegisterPage;
