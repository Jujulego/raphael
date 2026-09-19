import { currentSession } from '@/lib/auth/session';
import { prisma } from '@/lib/prisma.client';
import type { RepositoryOrderByWithRelationInput } from '@/lib/prisma/models/Repository';
import RepositoryTable from '@/lib/repositories/RepositoryTable';
import { getSearchParam, type RouteSearchParams } from '@/lib/utils/next';
import { loadPage } from '@/lib/utils/prisma';

// Configuration
const PAGE_SIZE = 20;

// Component
export default async function UserRepositoriesTable({
  className,
  searchParams,
}: AllRepositoriesTableProps) {
  const session = await currentSession();

  const orderBy = await extractSort(searchParams);
  const page = await loadPage(prisma.repositoryStats, {
    take: PAGE_SIZE,
    where: {
      installations: {
        some: {
          installation: {
            account: {
              userId: session.user.id,
            },
          },
        },
      },
    },
    orderBy,
  });

  async function loadMore(skip: number) {
    'use server';

    const session = await currentSession();

    return await prisma.repositoryStats.findMany({
      take: PAGE_SIZE,
      skip,
      where: {
        installations: {
          some: {
            installation: {
              account: {
                userId: session.user.id,
              },
            },
          },
        },
      },
      orderBy,
    });
  }

  return (
    <RepositoryTable
      className={className}
      page={page}
      pageSize={PAGE_SIZE}
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
