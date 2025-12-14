import { getClient } from '@/lib/apollo.client';
import RepositoryTable from '@/lib/components/RepositoryTable';
import { REPOSITORY_TABLE } from '@/lib/components/RepositoryTable.query';
import type { UserQuery, UserQueryVariables } from '@/types/graphql';
import type { TypedDocumentNode } from '@apollo/client';
import gql from 'graphql-tag';
import { Suspense } from 'react';

const Query: TypedDocumentNode<UserQuery, UserQueryVariables> = gql`
  query User($login: String!) {
    user(login: $login) {
      id
      repositories(last: 10) {
        ...RepositoryTable
      }
    }
  }

  ${REPOSITORY_TABLE}
`;

export default async function Home() {
  const { data } = await getClient().query({ query: Query, variables: { login: 'jujulego' } });

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {data?.user && <RepositoryTable data={data.user.repositories} />}
    </Suspense>
  );
}
