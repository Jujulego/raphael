import type { RepositoryPageFragment } from '@/lib/types/graphql';
import type { TypedDocumentNode } from '@apollo/client';
import gql from 'graphql-tag';
import { RepositoryItem } from './RepositoryItem';

export const RepositoryPage: TypedDocumentNode<RepositoryPageFragment> = gql`
  fragment RepositoryPage on RepositoryConnection {
    edges {
      cursor
      node {
        ...RepositoryItem
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }

  ${RepositoryItem}
`;
