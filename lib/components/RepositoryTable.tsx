'use client';

import type { RepositoryTableFragment } from '@/types/graphql';

export default function RepositoryTable({ data }: RepositoryTableProps) {
  return (
    <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
}

export interface RepositoryTableProps {
  readonly data: RepositoryTableFragment;
}
