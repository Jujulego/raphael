import type { RepositoryItemFragment } from '@/types/graphql';
import type { TypedDocumentNode } from '@apollo/client';
import gql from 'graphql-tag';

export const RepositoryItem: TypedDocumentNode<RepositoryItemFragment> = gql`
  fragment RepositoryItem on Repository {
    id
    name
    owner {
      id
      login
    }
    issues(states: [OPEN]) {
      totalCount
    }
    pullRequests(states: [OPEN]) {
      totalCount
    }
  }
`;
