import { currentSession } from '@/lib/auth/session';
import type { RepositoryOrderByWithRelationInput } from '@/lib/prisma/models/Repository';
import {
  countUserRepositories,
  findUserRepositoriesStats,
} from '@/lib/repositories/data/user-repostitories';
import RepositoryTable from '@/lib/repositories/ui/RepositoryTable';
import { getSearchParam, type RouteSearchParams } from '@/lib/utils/next';

// Configuration
const PAGE_SIZE = 20;

// Component
export default async function UserRepositoryTable({
  className,
  searchParams,
}: AllRepositoriesTableProps) {
  const session = await currentSession();

  const orderBy = await extractSort(searchParams);
  const [firstPage, totalCount] = await Promise.all([
    findUserRepositoriesStats(session.user.id, {
      take: PAGE_SIZE,
      orderBy,
    }),
    countUserRepositories(session.user.id),
  ]);

  async function loadMore(skip: number) {
    'use server';

    const session = await currentSession();

    return await findUserRepositoriesStats(session.user.id, {
      take: PAGE_SIZE,
      skip,
      orderBy,
    });
  }

  return (
    <RepositoryTable
      className={className}
      firstPage={firstPage}
      pageSize={PAGE_SIZE}
      totalCount={totalCount}
      loadMoreAction={loadMore}
    />
  );
}

export interface AllRepositoriesTableProps {
  readonly className?: string;
  readonly searchParams?: RouteSearchParams;
}

async function extractSort(
  searchParams?: RouteSearchParams,
): Promise<RepositoryOrderByWithRelationInput[]> {
  const orderBy: RepositoryOrderByWithRelationInput[] = [{ pushedAt: 'desc' }];
  const sort = await getSearchParam(searchParams, 'sort');

  if (sort) {
    const [column, order] = sort.split(':');

    if (['name', 'issueCount', 'openPullRequestCount'].includes(column)) {
      orderBy.unshift({
        [column]: order === 'desc' ? 'desc' : 'asc',
      });
    }
  }

  return orderBy;
}
