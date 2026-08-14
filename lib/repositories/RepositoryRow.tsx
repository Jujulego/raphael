import type { RepositoryData } from '@/lib/github/repositories/repository';
import Link from '@/lib/mui/Link';
import VirtualCell from '@/lib/virtual/VirtualCell';
import VirtualRow from '@/lib/virtual/VirtualRow';

export default function RepositoryRow({ data, index }: RepositoryRowProps) {
  return (
    <VirtualRow rowIndex={index}>
      <VirtualCell scope="row">
        <Link href={`https://github.com/${data.owner}/${data.name}`}>{data.name}</Link>
      </VirtualCell>
      <VirtualCell>{data.issueCount}</VirtualCell>
      <VirtualCell>{data.pullRequestCount}</VirtualCell>
    </VirtualRow>
  );
}

export interface RepositoryRowProps {
  readonly data: RepositoryData;
  readonly index: number;
}
