import RepositoryTableSkeleton from '@/lib/repositories/ui/RepositoryTableSkeleton';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('RepositoryTableSkeleton', () => {
  it('renders with same head than regular table', () => {
    render(<RepositoryTableSkeleton />);

    const table = screen.getByRole('table') as HTMLTableElement;

    expect(table.tHead).not.toBeNull();
    expect(table.tHead!.rows).toHaveLength(1);
    expect(table.tHead!.rows[0].cells).toHaveLength(3);

    expect(table.tHead!.rows[0].cells[0]).toHaveAccessibleName('Name');
    expect(table.tHead!.rows[0].cells[0]).toHaveRole('columnheader');

    expect(table.tHead!.rows[0].cells[1]).toHaveAccessibleName('Issues');
    expect(table.tHead!.rows[0].cells[1]).toHaveRole('columnheader');

    expect(table.tHead!.rows[0].cells[2]).toHaveAccessibleName('Pull requests');
    expect(table.tHead!.rows[0].cells[2]).toHaveRole('columnheader');
  });

  it('renders with 3 rows', () => {
    render(<RepositoryTableSkeleton />);

    const table = screen.getByRole('table') as HTMLTableElement;

    expect(table.tBodies).toHaveLength(1);
    expect(table.tBodies[0].rows).toHaveLength(3);
  });
});
