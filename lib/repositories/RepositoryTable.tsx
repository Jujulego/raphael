'use client';

import type { RepositoryData } from '@/lib/github/repositories/repository';
import { useSearchParam } from '@/lib/utils/useSearchParam';
import VirtualCell from '@/lib/virtual/VirtualCell';
import VirtualRow from '@/lib/virtual/VirtualRow';
import VirtualSortableCell from '@/lib/virtual/VirtualSortableCell';
import VirtualTable, { type RowFn } from '@/lib/virtual/VirtualTable';
import RepositoryRow from './RepositoryRow';
import RepositoryRowSkeleton from './RepositoryRowSkeleton';

export default function RepositoryTable({ className, data, count }: RepositoryTableProps) {
  const loadedCount = data.length;

  const [sort = '', setSort] = useSearchParam('sort');

  return (
    <VirtualTable
      className={className}
      data={data}
      columnLayout="2fr 1fr 1fr"
      loadedCount={loadedCount}
      rowCount={count}
      row={repositoryRow}
      head={
        <VirtualRow aria-rowindex={1}>
          <VirtualSortableCell
            column="name"
            scope="col"
            size="small"
            sort={sort}
            onSortChange={setSort}
          >
            Name
          </VirtualSortableCell>
          <VirtualSortableCell
            column="issueCount"
            scope="col"
            size="small"
            sort={sort}
            onSortChange={setSort}
          >
            Issues
          </VirtualSortableCell>
          <VirtualCell scope="col" size="small">
            Pull requests
          </VirtualCell>
        </VirtualRow>
      }
    />
  );
}

export interface RepositoryTableProps {
  readonly className?: string;
  readonly data: readonly RepositoryData[];
  readonly count: number;
}

// Utils
const repositoryRow: RowFn<readonly RepositoryData[]> = ({ data, index }) => {
  const item = data[index];

  if (item) {
    const key = `${item.owner}/${item.name}`;
    return <RepositoryRow key={key} data={item} index={index} />;
  }

  return <RepositoryRowSkeleton key={index} index={index} />;
};
