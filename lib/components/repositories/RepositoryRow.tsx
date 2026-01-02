import type { Repository } from '../../prisma/client';
import VirtualCell from '../virtual/VirtualCell';
import VirtualRow from '../virtual/VirtualRow';

// Component
export default function RepositoryRow({ data, index }: RepositoryRowProps) {
  return (
    <VirtualRow rowIndex={index}>
      <VirtualCell scope="row">{data.name}</VirtualCell>
      <VirtualCell>{data.issueCount}</VirtualCell>
      <VirtualCell>{data.pullRequestCount}</VirtualCell>
    </VirtualRow>
  );
}

export interface RepositoryRowProps {
  readonly data: Repository;
  readonly index: number;
}
