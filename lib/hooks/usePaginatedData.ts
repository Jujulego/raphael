import type { RowInterval } from '@/lib/virtual/VirtualTable';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Configuration for {@link usePaginatedData}.
 *
 * @typeParam T - The type of each data item.
 */
export interface PaginatedDataProps<T> {
  /** Initial items to display before loading more pages. */
  readonly firstPage: readonly T[];
  /** Loads items beginning at the given zero-based offset. */
  readonly loadMore: (skip: number) => Promise<readonly T[]>;
  /** Number of items requested per page. */
  readonly pageSize: number;
}

/**
 * Data and interval loader returned by {@link usePaginatedData}.
 *
 * @typeParam T - The type of each data item.
 */
export interface PaginatedDataState<T> {
  /** Loaded items, with `null` placeholders for unloaded gaps. */
  readonly data: readonly (T | null)[];
  /** Requests the pages intersecting a visible row interval. */
  readonly loadInterval: (interval: RowInterval) => void;
}

/**
 * Manages paginated data for a virtualized list or table.
 *
 * Initializes with `firstPage` and loads additional pages as requested
 * intervals become visible. Requested intervals are rounded to page boundaries.
 * When `firstPage` changes, the data resets and the current interval is loaded
 * again.
 *
 * @typeParam T - The type of each data item.
 * @param props - The initial page, page loader, and page size.
 * @returns The loaded data and a function for requesting a visible row interval.
 */
export function usePaginatedData<T>(props: PaginatedDataProps<T>): PaginatedDataState<T> {
  const { firstPage, loadMore, pageSize } = props;

  const loadedPages = useRef(new Set<number>());
  const currentInterval = useRef<RowInterval | null>(null);

  const [data, setData] = useState<readonly (T | null)[]>(firstPage);
  const [oldFirstPage, setOldFirstPage] = useState(firstPage);

  if (oldFirstPage !== firstPage) {
    setOldFirstPage(firstPage);
    setData(firstPage);
  }

  const loadInterval = useCallback(
    (interval: RowInterval) => {
      currentInterval.current = interval;

      for (
        let page = interval.first - (interval.first % pageSize);
        page <= interval.last;
        page += pageSize
      ) {
        if (loadedPages.current.has(page)) {
          continue;
        }

        loadedPages.current.add(page);
        loadMore(page).then((newItems) => {
          setData((old) => {
            const updated = [...old];

            while (updated.length < page) {
              updated.push(null);
            }

            updated.splice(page, newItems.length, ...newItems);

            return updated;
          });
        });
      }
    },
    [loadMore, pageSize],
  );

  useEffect(() => {
    loadedPages.current.clear();

    for (let i = 0; i < firstPage.length; i += pageSize) {
      loadedPages.current.add(i);
    }

    if (currentInterval.current) {
      loadInterval(currentInterval.current);
    }
  }, [firstPage, loadInterval, pageSize]);

  return {
    data,
    loadInterval,
  };
}
