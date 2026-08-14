import prisma from '@/lib/prisma.client';
import type { RepositoryOrderByWithRelationInput } from '@/lib/prisma/models/Repository';
import RepositoryTable from '@/lib/repositories/RepositoryTable';
import { extractSearchParam, type RouteSearchParams } from '@/lib/utils/next';

export default async function AllRepositoriesTable({
  className,
  searchParams,
}: AllRepositoriesTableProps) {
  const [rawData, count] = await prisma.$transaction([
    prisma.repository.findMany({
      orderBy: await extractSort(searchParams),
      include: {
        _count: {
          select: {
            pullRequests: {
              where: {
                state: 'OPEN',
              },
            },
          },
        },
      },
    }),
    prisma.repository.count(),
  ]);

  const data = rawData.map((repository) => ({
    ...repository,
    pullRequestCount: repository._count.pullRequests,
  }));

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
  const sort = await extractSearchParam(searchParams, 'sort');

  if (sort) {
    const [column, order] = sort.split(':');

    if (['name', 'issueCount', 'pullRequestCount'].includes(column)) {
      orderBy.unshift(
        column === 'pullRequestCount'
          ? {
              pullRequests: {
                _count: order === 'desc' ? 'desc' : 'asc',
              },
            }
          : {
              [column]: order === 'desc' ? 'desc' : 'asc',
            },
      );
    }
  }

  return orderBy;
}
