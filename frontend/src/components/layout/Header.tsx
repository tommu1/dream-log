'use client';

import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Button } from '../common/Button';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  height: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 640px) {
    padding: 0 1rem;
  }
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
  text-decoration: none;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 640px) {
    gap: 0.5rem;
  }
`;

const NavLink = styled(Link)`
  color: #4b5563;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background-color: #f3f4f6;
  }

  @media (max-width: 640px) {
    padding: 0.5rem;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  console.log('Current user:', user); // デバッグ用ログ

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/login');
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo href='/'>Dream Log</Logo>
        <Nav>
          {user ? (
            <>
              <NavLink href='/dreams'>タイムライン</NavLink>
              <NavLink href={`/users/${encodeURIComponent(user.username)}`}>プロフィール</NavLink>
              <NavLink href='/search'>検索</NavLink>
              <UserMenu>
                <Button $variant='secondary' $size='small' onClick={handleLogout}>
                  ログアウト
                </Button>
              </UserMenu>
            </>
          ) : (
            <>
              <NavLink href='/login'>ログイン</NavLink>
              <Button $variant='primary' onClick={() => router.push('/register')}>
                新規登録
              </Button>
            </>
          )}
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
}
