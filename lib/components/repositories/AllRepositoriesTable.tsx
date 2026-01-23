import RepositoryTable from '@/lib/components/repositories/RepositoryTable';
import prisma from '@/lib/prisma.client';
import { cacheTag } from 'next/cache';

export async function AllRepositoriesTable({ className }: AllRepositoriesTableProps) {
  'use cache';

  cacheTag('repositories');

  const [data, count] = await prisma.$transaction([
    prisma.repository.findMany({ orderBy: { pushedAt: 'desc' } }),
    prisma.repository.count(),
  ]);

  return <RepositoryTable className={className} data={data} count={count} />;
}

export interface AllRepositoriesTableProps {
  readonly className?: string;
}
