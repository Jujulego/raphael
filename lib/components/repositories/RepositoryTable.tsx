'use client';

import type { RepositoryTableFragment } from '@/types/graphql';
import { useCallback } from 'react';
import VirtualTable, { type RowFn, type RowInterval } from '../virtual/VirtualTable';
import RepositoryRow from './RepositoryRow';
import RepositoryRowSkeleton from './RepositoryRowSkeleton';

// Component
export default function RepositoryTable({ className, data, onLoadMore }: RepositoryTableProps) {
  const loadedCount = data.edges?.length ?? 0;

  const handleIntervalChange = useCallback(
    ({ first, last }: RowInterval) => {
      if (!onLoadMore) return;

      if (last >= loadedCount) {
        onLoadMore(data.pageInfo.endCursor, last - first);
      }
    },
    [data.pageInfo.endCursor, loadedCount, onLoadMore],
  );

  return (
    <VirtualTable
      className={className}
      data={data}
      columnLayout="2fr 1fr 1fr"
      loadedCount={loadedCount}
      rowCount={data.totalCount}
      row={repositoryRow}
      onIntervalChange={handleIntervalChange}
    />
  );
}

export interface RepositoryTableProps {
  readonly className?: string;
  readonly data: RepositoryTableFragment;
  readonly onLoadMore?: (cursor: string | null, limit: number) => void;
}

// Utils
const repositoryRow: RowFn<RepositoryTableFragment> = ({ data, index }) => {
  const item = data.edges?.[index]?.node;

  if (item) {
    return <RepositoryRow key={item.id} data={item} index={index} />;
  }

  return <RepositoryRowSkeleton key={index} index={index} />;
};
