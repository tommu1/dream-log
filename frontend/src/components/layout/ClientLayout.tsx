'use client';

import { Header } from '@/components/layout/Header';
import StyledComponentsRegistry from '@/lib/registry';
import { store } from '@/store';
import { getCurrentUser } from '@/store/slices/authSlice';
import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import '../../app/globals.css';

const inter = Inter({ subsets: ['latin'] });

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: #f3f4f6;
    color: #1f2937;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
`;

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  useEffect(() => {
    store.dispatch(getCurrentUser());
  }, []);

  return (
    <Provider store={store}>
      <StyledComponentsRegistry>
        <GlobalStyle />
        <Header />
        <main style={{ paddingTop: '4rem' }}>{children}</main>
      </StyledComponentsRegistry>
    </Provider>
  );
}
