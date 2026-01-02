'use cache';

import RepositoryTable from '@/lib/components/repositories/RepositoryTable';
import prisma from '@/lib/prisma.client';
import { cacheTag } from 'next/cache';

export default async function Home() {
  cacheTag('repositories');

  const data = await prisma.repository.findMany();
  const count = await prisma.repository.count();

  return <RepositoryTable className="h-screen" data={data} count={count} />;
}
