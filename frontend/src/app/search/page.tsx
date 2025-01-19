'use client';

import { DreamList } from '@/components/dream/DreamList';
import { SearchForm } from '@/components/search/SearchForm';
import SortSelect from '@/components/search/SortSelect';
import { Dream } from '@/types';
import { api } from '@/utils/api';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1024px;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
`;

const NoResults = styled.div`
  text-align: center;
  color: #6b7280;
  padding: 2rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ResultCount = styled.div`
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
`;

const SearchPage = () => {
  const searchParams = useSearchParams();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = searchParams.get('q') || '';
  const tag = searchParams.get('tag') || '';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const fetchDreams = async () => {
      if (!query && !tag) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get('/dreams/search', {
          params: {
            q: query,
            tag: tag,
            sort: sort
          }
        });
        setDreams(response.data.dreams);
      } catch (err) {
        setError('検索に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchDreams();
  }, [query, tag, sort]);

  return (
    <Container>
      <Header>
        <Title>夢を検索</Title>
      </Header>

      <SearchForm initialQuery={query} initialTag={tag} initialSort={sort} />

      {error ? (
        <NoResults>{error}</NoResults>
      ) : dreams.length === 0 && !loading ? (
        <NoResults>
          {query || tag ? '検索結果が見つかりませんでした。' : '検索キーワードを入力してください。'}
        </NoResults>
      ) : (
        <>
          <ResultHeader>
            <ResultCount>{dreams.length}件の結果が見つかりました</ResultCount>
            <SortSelect
              value={sort}
              onChange={value => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('sort', value);
                window.history.pushState(null, '', `?${params.toString()}`);
                // Next.jsのルーターを使用しないのは、ページ全体のリロードを避けるため
              }}
            />
          </ResultHeader>
          <DreamList dreams={dreams} loading={loading} />
        </>
      )}
    </Container>
  );
};

export default SearchPage;
