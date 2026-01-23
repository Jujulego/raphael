import { AllRepositoriesTable } from '@/lib/components/repositories/AllRepositoriesTable';
import { RepositoryTableSkeleton } from '@/lib/components/repositories/RepositoryTableSkeleton';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Divider from '@mui/material/Divider';
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <Breadcrumbs className="mx-6 mt-4 mb-6">
        <p className="text-text-primary">Repositories</p>
      </Breadcrumbs>

      <h1 className="mx-6 mb-6 typography-h4">Repositories</h1>

      <Divider className="border-TableCell-border" />

      <Suspense fallback={<RepositoryTableSkeleton />}>
        <AllRepositoriesTable className="h-full" />
      </Suspense>
    </>
  );
}
