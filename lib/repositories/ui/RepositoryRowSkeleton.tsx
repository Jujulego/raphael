import Skeleton from '@mui/material/Skeleton';
import VirtualCell from '../../virtual/VirtualCell';
import VirtualRow from '../../virtual/VirtualRow';

export default function RepositoryRowSkeleton({ index }: RepositoryRowSkeletonProps) {
  return (
    <VirtualRow className="group" rowIndex={index}>
      <VirtualCell scope="row">
        <Skeleton className="w-3/4 group-nth-[3n+1]:w-4/5 group-nth-[3n+2]:w-3/5" />
      </VirtualCell>
      <VirtualCell>
        <Skeleton className="w-1/4" />
      </VirtualCell>
      <VirtualCell>
        <Skeleton className="w-1/4" />
      </VirtualCell>
    </VirtualRow>
  );
}

export interface RepositoryRowSkeletonProps {
  readonly index: number;
}
