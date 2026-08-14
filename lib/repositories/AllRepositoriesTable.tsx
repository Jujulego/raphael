import prisma from '@/lib/prisma.client';
import type { RepositoryOrderByWithRelationInput } from '@/lib/prisma/models/Repository';
import { listRepositories } from '@/lib/repositories/repositories.db';
import RepositoryTable from '@/lib/repositories/RepositoryTable';
import { extractSearchParam, type RouteSearchParams } from '@/lib/utils/next';

export default async function AllRepositoriesTable({
  className,
  searchParams,
}: AllRepositoriesTableProps) {
  const [data, count] = await Promise.all([
    listRepositories({
      orderBy: await extractSort(searchParams),
    }),
    prisma.repository.count(),
  ]);

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

    if (['name', 'issueCount'].includes(column)) {
      orderBy.unshift({
        [column]: order === 'desc' ? 'desc' : 'asc',
      });
    }
  }

  return orderBy;
}
