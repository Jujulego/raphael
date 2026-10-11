import RepositoryBreadcrumb from '@/app/(console)/repositories/[owner]/[name]/RepositoryBreadcrumb';
import Link from '@/lib/mui/Link';
import { prisma } from '@/lib/prisma.client';
import RepositoryActivityGraph from '@/lib/repositories/RepositoryActivityGraph';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Skeleton from '@mui/material/Skeleton';
import { Suspense } from 'react';

export default function RepositoryPage({ params }: PageProps<'/repositories/[owner]/[name]'>) {
  return (
    <>
      <Breadcrumbs className="mx-6 mt-4 mb-6">
        <Link href="/" color="inherit" underline="hover">
          Console
        </Link>
        <Link href="/repositories" color="inherit" underline="hover">
          Repositories
        </Link>
        <Suspense fallback={<Skeleton width={64} />}>
          <RepositoryBreadcrumb content={params.then((p) => p.owner)} />
        </Suspense>
        <Suspense fallback={<Skeleton width={64} />}>
          <RepositoryBreadcrumb
            className="text-text-primary"
            content={params.then((p) => p.name)}
          />
        </Suspense>
      </Breadcrumbs>

      <Suspense>
        <RepositoryActivityGraph className="m-4 grow" params={params} />
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
