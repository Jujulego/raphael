import { getClient } from '@/lib/apollo.client';
import RepositoryTable from '@/lib/components/repositories/RepositoryTable';
import type { UserQuery, UserQueryVariables } from '@/types/graphql';
import type { TypedDocumentNode } from '@apollo/client';
import gql from 'graphql-tag';
import { Suspense } from 'react';
import { RepositoryTableFgm } from '../lib/components/repositories/RepositoryTable.gql';

const Query: TypedDocumentNode<UserQuery, UserQueryVariables> = gql`
  query User($login: String!) {
    user(login: $login) {
      id
      repositories(last: 10) {
        ...RepositoryTable
      }
    }
  }

  ${RepositoryTableFgm}
`;

export default async function Home() {
  const { data } = await getClient().query({ query: Query, variables: { login: 'jujulego' } });

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {data?.user && <RepositoryTable data={data.user.repositories} />}
    </Suspense>
  );
}
