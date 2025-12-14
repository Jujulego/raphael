import type { RepositoryRowFragment } from '@/types/graphql';
import type { TypedDocumentNode } from '@apollo/client';
import gql from 'graphql-tag';
import VirtualCell from '../virtual/VirtualCell';
import VirtualRow from '../virtual/VirtualRow';

// Component
export default function RepositoryRow({ data, index }: RepositoryRowProps) {
  return (
    <VirtualRow rowIndex={index}>
      <VirtualCell scope="row">{data.name}</VirtualCell>
      <VirtualCell>{data.issues.totalCount}</VirtualCell>
      <VirtualCell>{data.pullRequests.totalCount}</VirtualCell>
    </VirtualRow>
  );
}

export interface RepositoryRowProps {
  readonly data: RepositoryRowFragment;
  readonly index: number;
}

// Fragment
export const RepositoryRowFgm: TypedDocumentNode<RepositoryRowFragment> = gql`
  fragment RepositoryRow on Repository {
    id
    name
    issues(states: [OPEN]) {
      totalCount
    }
    pullRequests(states: [OPEN]) {
      totalCount
    }
  }
`;
