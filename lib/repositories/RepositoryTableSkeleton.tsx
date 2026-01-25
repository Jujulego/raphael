import RepositoryRowSkeleton from '@/lib/repositories/RepositoryRowSkeleton';
import VirtualCell from '@/lib/virtual/VirtualCell';
import VirtualRow from '@/lib/virtual/VirtualRow';
import VirtualTableSkeleton from '@/lib/virtual/VirtualTableSkeleton';

// Component
export default function RepositoryTableSkeleton() {
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
