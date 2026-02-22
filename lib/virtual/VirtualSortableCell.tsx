'use client';

import type { VirtualCellProps } from '@/lib/virtual/VirtualCell';
import VirtualCell from '@/lib/virtual/VirtualCell';
import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import ButtonBase from '@mui/material/ButtonBase';
import { clsx } from 'clsx';
import { type MouseEvent, useCallback } from 'react';

export interface VirtualSortableCellProps extends Omit<VirtualCellProps, 'padding' | 'aria-sort'> {
  readonly column: string;
  readonly sort?: string;
  readonly onSortChange?: (sort?: string) => void;
}

export default function VirtualSortableCell(props: VirtualSortableCellProps) {
  const { className, children, column, sort = '', onSortChange, ...rest } = props;

  const [sortBy, sortDirection] = sort.split(':');

  const handleClick = useCallback(
    (event: MouseEvent<HTMLTableCellElement>) => {
      if (!onSortChange) return;

      switch (event.currentTarget.ariaSort) {
        case 'ascending':
          onSortChange(`${column}:desc`);
          break;

        case 'descending':
          onSortChange();
          break;

        default:
          onSortChange(`${column}:asc`);
      }
    },
    [column, onSortChange],
  );

  return (
    <VirtualCell
      {...rest}
      className={clsx('group', className)}
      padding="none"
      aria-sort={formatAriaSort(sortBy === column, sortDirection)}
      onClick={handleClick}
    >
      <ButtonBase className="w-full justify-start px-4 py-1.5">
        {children}
        <div className="relative ml-2 size-6">
          <ArrowUpward className="absolute top-0 left-0 text-gray-500/0 transition-colors group-aria-[sort=descending]:text-white" />
          <ArrowDownward className="absolute top-0 left-0 text-gray-500/0 transition-colors group-aria-[sort=ascending]:text-white group-aria-[sort=none]:group-hover:text-gray-500" />
        </div>
      </ButtonBase>
    </VirtualCell>
  );
}

function formatAriaSort(active: boolean, direction: string) {
  if (!active) {
    return 'none';
  }

  return direction === 'desc' ? 'descending' : 'ascending';
}
