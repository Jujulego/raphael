import type { RepositoryTableRowFragment, RepositoryTableFragment } from '@/types/graphql';
import type { TypedDocumentNode } from '@apollo/client';
import gql from 'graphql-tag';

export const REPOSITORY_TABLE_ROW: TypedDocumentNode<RepositoryTableRowFragment> = gql`
  fragment RepositoryTableRow on Repository {
    id
    description
    isArchived
    isDisabled
    isTemplate
    name
    nameWithOwner
    pushedAt
    visibility
    issues(states: [OPEN]) {
      totalCount
    }
    pullRequests(states: [OPEN]) {
      totalCount
    }
  }
`;

export const REPOSITORY_TABLE: TypedDocumentNode<RepositoryTableFragment> = gql`
  fragment RepositoryTable on RepositoryConnection {
    nodes {
      ...RepositoryTableRow
    }
  }

  ${REPOSITORY_TABLE_ROW}
`;
