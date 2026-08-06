import type { Octokit } from '@octokit/core';
import { collect$, pipe$, type PipeStep, type SimpleIterator } from 'kyrielle';

// Types
export interface PageQuery {
  readonly first?: number | null;
  readonly after?: string | null;
}

export interface Page<N> {
  readonly nodes: readonly N[];
  readonly endCursor: string | null;
  readonly hasNextPage: boolean;
  readonly totalCount: number;
}

export type PageLoader<Q extends PageQuery, T> = (octokit: Octokit, query: Q) => Promise<Page<T>>;

export interface GraphqlConnection<N> {
  readonly nodes: readonly N[] | null;
  readonly totalCount: number;
  readonly pageInfo: {
    readonly endCursor: string | null;
    readonly hasNextPage: boolean;
  };
}

// Utils
export function mapConnection<O, R>(
  connection: GraphqlConnection<O>,
  mapper: PipeStep<readonly O[], SimpleIterator<R>>,
): Page<R> {
  return {
    nodes: pipe$(connection.nodes ?? [], mapper, collect$()),
    endCursor: connection.pageInfo.endCursor,
    hasNextPage: connection.pageInfo.hasNextPage,
    totalCount: connection.totalCount,
  };
}

export async function* paginator<Q extends PageQuery, T>(
  loader: PageLoader<Q, T>,
  octokit: Octokit,
  query: Q,
): AsyncGenerator<T, void> {
  const first = query.first ?? 100;
  let after = query.after ?? null;
  let hasNext = true;

  do {
    const page = await loader(octokit, { ...query, first, after });

    yield* page.nodes;

    after = page.endCursor;
    hasNext = page.hasNextPage;
  } while (hasNext);
}
