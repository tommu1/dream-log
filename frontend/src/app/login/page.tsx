'use client';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { AppDispatch } from '@/store';
import { login } from '@/store/slices/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 32rem;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const Form = styled.form`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  text-align: center;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const RegisterLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #4b5563;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setLoading(true);

    try {
      const result = await dispatch(login(formData)).unwrap();
      if (result) {
        setTimeout(() => {
          router.replace('/dreams');
        }, 100);
      }
    } catch (err: any) {
      setError(err.message || 'ログインに失敗しました');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>ログイン</Title>
        <FormGroup>
          <Input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='メールアドレス'
            required
            $fullWidth
          />
        </FormGroup>
        <FormGroup>
          <Input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='パスワード'
            required
            $fullWidth
          />
        </FormGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type='submit' $variant='primary' $loading={loading} $fullWidth>
          ログイン
        </Button>
        <RegisterLink href='/register'>アカウントをお持ちでない方はこちら</RegisterLink>
      </Form>
    </Container>
  );
}
