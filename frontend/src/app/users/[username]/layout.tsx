import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ユーザープロフィール - Dream Log',
  description: 'ユーザーのプロフィールと投稿した夢を表示します。'
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return children;
}
