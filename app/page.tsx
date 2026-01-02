import prisma from '@/lib/prisma.client';
import RepositoryTable from '../lib/components/repositories/RepositoryTable';

export default async function Home() {
  const data = await prisma.repository.findMany();
  const count = await prisma.repository.count();

  return <RepositoryTable className="h-screen" data={data} count={count} />;
}
