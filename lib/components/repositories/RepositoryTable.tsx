'use client';

import type { RepositoryTableFragment } from '@/types/graphql';
import VirtualTable, { type RowFn } from '../virtual/VirtualTable';
import RepositoryRow from './RepositoryRow';
import RepositoryRowSkeleton from './RepositoryRowSkeleton';

// Component
export default function RepositoryTable({ data }: RepositoryTableProps) {
  return (
    <VirtualTable
      data={data}
      columnLayout="2fr 1fr 1fr"
      loadedCount={data.nodes?.length}
      rowCount={data.totalCount}
      row={repositoryRow}
    />
  );
}

export interface RepositoryTableProps {
  readonly data: RepositoryTableFragment;
}

// Utils
const repositoryRow: RowFn<RepositoryTableFragment> = ({ data, index }) => {
  const item = data.nodes?.[index];

  if (item) {
    return <RepositoryRow key={item.id} data={item} index={index} />;
  }

  return <RepositoryRowSkeleton key={index} index={index} />;
};
