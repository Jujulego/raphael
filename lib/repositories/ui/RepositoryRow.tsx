import type { RepositoryStats } from '@/lib/prisma/client';
import VirtualCell from '@/lib/virtual/VirtualCell';
import VirtualRow from '@/lib/virtual/VirtualRow';
import ButtonBase from '@mui/material/ButtonBase';
import Link from 'next/link';

export default function RepositoryRow({ repository, index }: RepositoryRowProps) {
  return (
    <VirtualRow rowIndex={index}>
      <VirtualCell scope="row" padding="none">
        <ButtonBase
          className="size-full justify-start p-4 hover:bg-action-hover"
          component={Link}
          href={`/repositories/${repository.owner}/${repository.name}`}
        >
          {repository.name}
        </ButtonBase>
      </VirtualCell>
      <VirtualCell>{repository.issueCount}</VirtualCell>
      <VirtualCell>{repository.openPullRequestCount}</VirtualCell>
    </VirtualRow>
  );
}

export interface RepositoryRowProps {
  readonly repository: RepositoryStats;
  readonly index: number;
}
