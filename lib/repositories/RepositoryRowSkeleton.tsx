import Skeleton from '@mui/material/Skeleton';
import VirtualCell from '../virtual/VirtualCell';
import VirtualRow from '../virtual/VirtualRow';

// Component
export default function RepositoryRowSkeleton({ index }: RepositoryRowSkeletonProps) {
  return (
    <VirtualRow rowIndex={index}>
      <VirtualCell scope="row">
        <Skeleton width="75%" />
      </VirtualCell>
      <VirtualCell>
        <Skeleton width="75%" />
      </VirtualCell>
      <VirtualCell>
        <Skeleton width="75%" />
      </VirtualCell>
    </VirtualRow>
  );
}

export interface RepositoryRowSkeletonProps {
  readonly index: number;
}
