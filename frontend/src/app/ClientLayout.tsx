'use client';

import { Header } from '@/components/layout/Header';
import { store } from '@/store';
import { getCurrentUser } from '@/store/slices/authSlice';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import styled from 'styled-components';
import { StyledComponentsRegistry } from './registry';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const Main = styled.main`
  padding-top: 4rem;
  min-height: 100vh;
  background-color: #f3f4f6;
  width: 100%;
  overflow-x: hidden;
`;

export function ClientLayout({ children }: ClientLayoutProps) {
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      store.dispatch(getCurrentUser());
    }
  }, []);

  return (
    <StyledComponentsRegistry>
      <Provider store={store}>
        <Header />
        <Main>{children}</Main>
      </Provider>
    </StyledComponentsRegistry>
  );
}
