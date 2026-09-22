import RepositoryRowSkeleton from '@/lib/repositories/ui/RepositoryRowSkeleton';
import { count$ } from '@/lib/utils/count$';
import VirtualCell from '@/lib/virtual/VirtualCell';
import VirtualRow from '@/lib/virtual/VirtualRow';
import VirtualTableSkeleton from '@/lib/virtual/VirtualTableSkeleton';
import { collect$, map$, pipe$ } from 'kyrielle';

export default function RepositoryTableSkeleton(props: RepositoryTableSkeletonProps) {
  const { rowCount = 3 } = props;

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
      {pipe$(
        count$(0, rowCount),
        map$((index) => <RepositoryRowSkeleton key={index} index={index + 1} />),
        collect$(),
      )}
    </VirtualTableSkeleton>
  );
}

export interface RepositoryTableSkeletonProps {
  /** @default 3 */
  readonly rowCount?: number;
}
