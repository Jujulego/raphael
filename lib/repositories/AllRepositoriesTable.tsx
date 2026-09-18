import { auth } from '@/lib/auth/server';
import { prisma } from '@/lib/prisma.client';
import type { RepositoryOrderByWithRelationInput } from '@/lib/prisma/models/Repository';
import RepositoryTable from '@/lib/repositories/RepositoryTable';
import { getSearchParam, type RouteSearchParams } from '@/lib/utils/next';
import { loadPrismaPage } from '@/lib/utils/prisma';
import { headers } from 'next/headers';

export default async function AllRepositoriesTable({
  className,
  searchParams,
}: AllRepositoriesTableProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const { items: data, count } = await loadPrismaPage(prisma.repositoryStats, {
    take: 100,
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
    orderBy: await extractSort(searchParams),
  });

  return <RepositoryTable className={className} data={data} count={count} />;
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
