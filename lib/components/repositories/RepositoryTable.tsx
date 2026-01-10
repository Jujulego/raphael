'use client';

import type { Repository } from '../../prisma/client';
import VirtualTable, { type RowFn } from '../virtual/VirtualTable';
import RepositoryRow from './RepositoryRow';
import RepositoryRowSkeleton from './RepositoryRowSkeleton';

// Component
export default function RepositoryTable({ className, data, count }: RepositoryTableProps) {
  const loadedCount = data.length;

  return (
    <VirtualTable
      className={className}
      data={data}
      columnLayout="2fr 1fr 1fr"
      loadedCount={loadedCount}
      rowCount={count}
      row={repositoryRow}
    />
  );
}

export interface RepositoryTableProps {
  readonly className?: string;
  readonly data: readonly Repository[];
  readonly count: number;
}

// Utils
const repositoryRow: RowFn<readonly Repository[]> = ({ data, index }) => {
  const item = data[index];

  if (item) {
    const key = `${item.owner}/${item.name}`;
    return <RepositoryRow key={key} data={item} index={index} />;
  }

  return <RepositoryRowSkeleton key={index} index={index} />;
};
