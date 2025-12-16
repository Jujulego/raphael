'use client';

import RepositoryTable from '@/lib/components/repositories/RepositoryTable';
import type { UserQuery, UserQueryVariables } from '@/types/graphql';
import type { TypedDocumentNode } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import gql from 'graphql-tag';
import { Suspense, useCallback } from 'react';
import { RepositoryTableFgm } from '../lib/components/repositories/RepositoryTable.gql';

const Query: TypedDocumentNode<UserQuery, UserQueryVariables> = gql`
  query User($login: String!, $cursor: String, $limit: Int = 20) {
    user(login: $login) {
      id
      repositories(after: $cursor, first: $limit) {
        ...RepositoryTable
      }
    }
  }

  ${RepositoryTableFgm}
`;

export default function Home() {
  const { data, fetchMore } = useQuery(Query, { variables: { login: 'jujulego' } });

  const handleLoadMore = useCallback(
    (cursor: string, limit: number) => {
      fetchMore({
        variables: {
          login: 'jujulego',
          cursor,
          limit: Math.min(Math.max(limit, 20), 100),
        },
      });
    },
    [fetchMore],
  );

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
