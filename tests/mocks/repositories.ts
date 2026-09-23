import type { RepositoryStats } from '@/lib/prisma/client';
import { count$ } from '@/lib/utils/count$';
import { collect$, map$, pipe$ } from 'kyrielle';

export function makeRepository(
  index: number,
  overrides: Partial<RepositoryStats> = {},
): RepositoryStats {
  return {
    owner: 'acme',
    name: `repo-${index + 1}`,
    issueCount: (index * 3) % 17,
    openPullRequestCount: (index * 2) % 9,
    pushedAt: new Date(Date.UTC(2024, 0, index + 1)),
    ...overrides,
  };
}

export function makeRepositories(
  count: number,
  factory: (index: number) => Partial<RepositoryStats> = () => ({}),
): RepositoryStats[] {
  return pipe$(
    count$(0, count),
    map$((index) => makeRepository(index, factory(index))),
    collect$(),
  );
}
