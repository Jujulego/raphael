'use client';

import { usePaginatedData } from '@/lib/hooks/usePaginatedData';
import type { RepositoryStats } from '@/lib/prisma/client';
import type { PrismaPage } from '@/lib/utils/prisma';
import { useSearchParam } from '@/lib/utils/useSearchParam';
import VirtualRow from '@/lib/virtual/VirtualRow';
import VirtualSortableCell from '@/lib/virtual/VirtualSortableCell';
import VirtualTable, { type RowFn } from '@/lib/virtual/VirtualTable';
import RepositoryRow from './RepositoryRow';
import RepositoryRowSkeleton from './RepositoryRowSkeleton';

export default function RepositoryTable({
  className,
  page,
  pageSize,
  loadMoreAction,
}: RepositoryTableProps) {
  const [sort = '', setSort] = useSearchParam('sort');
  const { data, loadInterval } = usePaginatedData({
    initial: page.items,
    loadMore: loadMoreAction,
    pageSize,
  });

  return (
    <VirtualTable
      className={className}
      data={data}
      columnLayout="2fr 1fr 1fr"
      loadedCount={pageSize}
      rowCount={page.totalCount}
      row={repositoryRow}
      onIntervalChange={loadInterval}
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
          <VirtualSortableCell
            column="openPullRequestCount"
            scope="col"
            size="small"
            sort={sort}
            onSortChange={setSort}
          >
            Pull requests
          </VirtualSortableCell>
        </VirtualRow>
      }
    />
  );
}

export interface RepositoryTableProps {
  readonly className?: string;
  readonly page: PrismaPage<RepositoryStats>;
  readonly pageSize: number;
  readonly loadMoreAction: (skip: number) => Promise<RepositoryStats[]>;
}

// Utils
const repositoryRow: RowFn<readonly (RepositoryStats | null)[]> = ({ data, index }) => {
  const item = data[index];

  if (item) {
    const key = `${item.owner}/${item.name}`;
    return <RepositoryRow key={key} data={item} index={index} />;
  }

  return <RepositoryRowSkeleton key={index} index={index} />;
};
