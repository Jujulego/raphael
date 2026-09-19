import type { RowInterval } from '@/lib/virtual/VirtualTable';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface PaginatedDataProps<T> {
  readonly firstPage: readonly T[];
  readonly loadMore: (skip: number) => Promise<readonly T[]>;
  readonly pageSize: number;
}

export interface PaginatedDataState<T> {
  readonly data: readonly (T | null)[];
  readonly loadInterval: (interval: RowInterval) => void;
}

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
