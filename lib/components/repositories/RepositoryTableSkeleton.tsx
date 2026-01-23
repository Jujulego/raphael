import RepositoryRowSkeleton from '@/lib/components/repositories/RepositoryRowSkeleton';
import VirtualCell from '@/lib/components/virtual/VirtualCell';
import VirtualRow from '@/lib/components/virtual/VirtualRow';
import VirtualTableSkeleton from '@/lib/components/virtual/VirtualTableSkeleton';

// Component
export function RepositoryTableSkeleton() {
  return (
    <VirtualTableSkeleton
      columnLayout="2fr 1fr 1fr"
      head={
        <VirtualRow aria-rowindex={1}>
          <VirtualCell scope="col" size="small">
            Name
          </VirtualCell>
          <VirtualCell scope="col" size="small">
            Issues
          </VirtualCell>
          <VirtualCell scope="col" size="small">
            Pull requests
          </VirtualCell>
        </VirtualRow>
      }
    >
      <RepositoryRowSkeleton index={1} />
      <RepositoryRowSkeleton index={2} />
      <RepositoryRowSkeleton index={3} />
    </VirtualTableSkeleton>
  );
}
