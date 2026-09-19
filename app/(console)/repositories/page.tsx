import Link from '@/lib/mui/Link';
import UserRepositoriesTable from '@/lib/repositories/UserRepositoriesTable';
import RepositoryTableSkeleton from '@/lib/repositories/ui/RepositoryTableSkeleton';
import GitHubIcon from '@mui/icons-material/GitHub';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Divider from '@mui/material/Divider';
import { Suspense } from 'react';

export default function RepositoriesPage({ searchParams }: PageProps<'/repositories'>) {
  return (
    <>
      <Breadcrumbs className="mx-6 mt-4 mb-6">
        <Link href="/" color="inherit" underline="hover">
          Console
        </Link>
        <p className="text-text-primary">Repositories</p>
      </Breadcrumbs>

      <h1 className="mx-6 mb-6 typography-h4">
        <GitHubIcon className="mr-2 text-4xl" /> Repositories
      </h1>

      <Divider className="border-TableCell-border" />

      <Suspense fallback={<RepositoryTableSkeleton />}>
        <UserRepositoriesTable className="h-full" searchParams={searchParams} />
      </Suspense>
    </>
  );
}
