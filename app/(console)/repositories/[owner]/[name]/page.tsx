import { prisma } from '@/lib/prisma.client';

export default function RepositoryPage() {
  return null;
}

export async function generateStaticParams() {
  return await prisma.repository.findMany({
    select: {
      owner: true,
      name: true,
    },
  });
}
