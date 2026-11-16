import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Reads a search parameter and returns a function to update it in the URL.
 *
 * The setter preserves other search parameters. Passing an empty or omitted
 * value removes the parameter.
 *
 * @param name - The name of the search parameter.
 * @returns A tuple containing the parameter value (or `undefined`) and its setter.
 */
export function useSearchParam(name: string) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const setSearchParam = useCallback(
    (value?: string | undefined) => {
      const url = new URL(window.location.href);

      if (value) {
        url.searchParams.set(name, value);
      } else {
        url.searchParams.delete(name);
      }

      router.replace(url.toString());
    },
    [name, router],
  );

  return [searchParams.get(name) ?? undefined, setSearchParam] as const;
}
