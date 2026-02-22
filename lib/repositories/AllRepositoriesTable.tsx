import prisma from '@/lib/prisma.client';
import type { RepositoryOrderByWithRelationInput } from '@/lib/prisma/models/Repository';
import RepositoryTable from '@/lib/repositories/RepositoryTable';
import { extractSearchParam, type RouteSearchParams } from '@/lib/utils/next';
import { cacheTag } from 'next/cache';

export default async function AllRepositoriesTable({
  className,
  searchParams,
}: AllRepositoriesTableProps) {
  'use cache';

  cacheTag('repositories');

  const [data, count] = await prisma.$transaction([
    prisma.repository.findMany({ orderBy: await extractSort(searchParams) }),
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

    if (['name', 'issueCount', 'pullRequestCount'].includes(column)) {
      orderBy.unshift({
        [column]: order === 'desc' ? 'desc' : 'asc',
      });
    }
  }

  return orderBy;
}
