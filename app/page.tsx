'use client';

import RepositoryTable from '@/lib/components/repositories/RepositoryTable';
import { RepositoryTableFgm } from '@/lib/components/repositories/RepositoryTable.gql';
import type { UserQuery, UserQueryVariables } from '@/types/graphql';
import type { TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import gql from 'graphql-tag';
import { Suspense, useCallback, useEffect, useRef } from 'react';
import { exhaustMap, Subject } from 'rxjs';

export default function Home() {
  const { data, fetchMore } = useQuery(Query, { variables: { login: 'jujulego' } });

  const page$ = useRef(new Subject<Pick<UserQueryVariables, 'cursor' | 'limit'>>());

  const handleLoadMore = useCallback((cursor: string | null, limit: number) => {
    page$.current.next({ cursor, limit: Math.min(Math.max(limit, 20), 100) });
  }, []);

  useEffect(() => {
    const sub = page$.current
      .pipe(exhaustMap((page) => fetchMore({ variables: { login: 'jujulego', ...page } })))
      .subscribe();

    return () => sub.unsubscribe();
  }, [fetchMore]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {data?.user && (
        <RepositoryTable
          className="h-screen"
          data={data.user.repositories}
          onLoadMore={handleLoadMore}
        />
      )}
    </Suspense>
  );
}

const Query: TypedDocumentNode<UserQuery, UserQueryVariables> = gql`
  query User($login: String!, $cursor: String, $limit: Int) {
    user(login: $login) {
      id
      repositories(after: $cursor, first: $limit) {
        ...RepositoryTable
      }
    }
  }

  ${RepositoryTableFgm}
`;
