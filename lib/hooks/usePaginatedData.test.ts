import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usePaginatedData } from './usePaginatedData';

describe('usePaginatedData', () => {
  it('starts with the first page and loads each requested page only once', async () => {
    const firstPage = [0, 1, 2];
    const loadMore = vi.fn(async (skip: number) => [skip, skip + 1, skip + 2]);
    const { result } = renderHook(() => usePaginatedData({ firstPage, loadMore, pageSize: 3 }));

    expect(result.current.data).toEqual([0, 1, 2]);

    act(() => {
      result.current.loadInterval({ first: 4, last: 6 });
      result.current.loadInterval({ first: 3, last: 3 });
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    });

    expect(loadMore.mock.calls).toEqual([[3], [6]]);
  });

  it('fills unloaded gaps with null placeholders', async () => {
    const firstPage = [0, 1];
    const loadMore = vi.fn(async (skip: number) => [skip, skip + 1]);
    const { result } = renderHook(() => usePaginatedData({ firstPage, loadMore, pageSize: 2 }));

    act(() => {
      result.current.loadInterval({ first: 4, last: 4 });
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([0, 1, null, null, 4, 5]);
    });
  });

  it('reloads the visible interval when the first page changes', async () => {
    const loadMore = vi.fn(async (skip: number) => [skip, skip + 1]);
    const { result, rerender } = renderHook(
      ({ firstPage }) => usePaginatedData({ firstPage, loadMore, pageSize: 2 }),
      { initialProps: { firstPage: [0, 1] } },
    );

    act(() => {
      result.current.loadInterval({ first: 2, last: 2 });
    });

    expect(loadMore).toHaveBeenCalledTimes(1);

    rerender({ firstPage: [10, 11] });

    await waitFor(() => {
      expect(result.current.data).toEqual([10, 11, 2, 3]);
    });

    expect(loadMore).toHaveBeenCalledTimes(2);
    expect(loadMore.mock.calls).toEqual([[2], [2]]);
  });
});
