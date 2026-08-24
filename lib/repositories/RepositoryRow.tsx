import Link from '@/lib/mui/Link';
import type { RepositoryStats } from '@/lib/prisma/client';
import VirtualCell from '@/lib/virtual/VirtualCell';
import VirtualRow from '@/lib/virtual/VirtualRow';

export default function RepositoryRow({ data, index }: RepositoryRowProps) {
  return (
    <VirtualRow rowIndex={index}>
      <VirtualCell scope="row">
        <Link href={`https://github.com/${data.owner}/${data.name}`}>{data.name}</Link>
      </VirtualCell>
      <VirtualCell>{data.issueCount}</VirtualCell>
      <VirtualCell>{data.openPullRequestCount}</VirtualCell>
    </VirtualRow>
  );
}

export interface RepositoryRowProps {
  readonly data: RepositoryStats;
  readonly index: number;
}
