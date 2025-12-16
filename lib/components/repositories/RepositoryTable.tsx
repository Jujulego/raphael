'use client';

import type { RepositoryTableFragment } from '@/types/graphql';
import { useCallback } from 'react';
import VirtualTable, { type RowFn, type RowInterval } from '../virtual/VirtualTable';
import RepositoryRow from './RepositoryRow';
import RepositoryRowSkeleton from './RepositoryRowSkeleton';

// Component
export default function RepositoryTable({ className, data, onLoadMore }: RepositoryTableProps) {
  const handleIntervalChange = useCallback(
    ({ first, last }: RowInterval) => {
      if (!data.edges) return;
      if (!onLoadMore) return;

      if (last > data.edges.length) {
        const edge = data.edges[data.edges.length - 1]!;
        onLoadMore(edge.cursor, last - first);
      }
    },
    [data.edges, onLoadMore],
  );

  return (
    <VirtualTable
      className={className}
      data={data}
      columnLayout="2fr 1fr 1fr"
      loadedCount={data.edges?.length ?? 0}
      rowCount={data.totalCount}
      row={repositoryRow}
      onIntervalChange={handleIntervalChange}
    />
  );
}

export interface RepositoryTableProps {
  readonly className?: string;
  readonly data: RepositoryTableFragment;
  readonly onLoadMore?: (cursor: string, limit: number) => void;
}

// Utils
const repositoryRow: RowFn<RepositoryTableFragment> = ({ data, index }) => {
  const item = data.edges?.[index]?.node;

  if (item) {
    return <RepositoryRow key={item.id} data={item} index={index} />;
  }

  return <RepositoryRowSkeleton key={index} index={index} />;
};
