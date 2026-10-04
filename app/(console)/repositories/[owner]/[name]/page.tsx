import Link from '@/lib/mui/Link';
import { prisma } from '@/lib/prisma.client';
import RepositoryActivityGraph from '@/lib/repositories/RepositoryActivityGraph';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Suspense } from 'react';

export default async function RepositoryPage({
  params,
}: PageProps<'/repositories/[owner]/[name]'>) {
  const { owner, name } = await params;

  return (
    <>
      <Breadcrumbs className="mx-6 mt-4 mb-6">
        <Link href="/" color="inherit" underline="hover">
          Console
        </Link>
        <Link href="/repositories" color="inherit" underline="hover">
          Repositories
        </Link>
        <p>{owner}</p>
        <p className="text-text-primary">{name}</p>
      </Breadcrumbs>

      <Suspense>
        <RepositoryActivityGraph className="m-4 grow" owner={owner} name={name} />
      </Suspense>
    </>
  );
}

export async function generateStaticParams() {
  return await prisma.repository.findMany({
    select: {
      owner: true,
      name: true,
    },
    take: 1000,
  });
}
