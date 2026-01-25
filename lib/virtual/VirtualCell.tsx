import TableCell, { type TableCellProps } from '@mui/material/TableCell';
import { mergeSx } from '../utils/mui';

// Component
export type VirtualCellProps = TableCellProps;

export default function VirtualCell({ sx, ...rest }: VirtualCellProps) {
  return (
    <TableCell
      {...rest}
      sx={mergeSx(
        {
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
        sx,
      )}
    />
  );
}
