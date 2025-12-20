import type { RepositoryTableFragment } from '@/types/graphql';
import type { TypedDocumentNode } from '@apollo/client';
import gql from 'graphql-tag';
import { RepositoryRowFgm } from './RepositoryRow';

export const RepositoryTableFgm: TypedDocumentNode<RepositoryTableFragment> = gql`
  fragment RepositoryTable on RepositoryConnection {
    edges {
      cursor
      node {
        ...RepositoryRow
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    totalCount
  }

  ${RepositoryRowFgm}
`;
