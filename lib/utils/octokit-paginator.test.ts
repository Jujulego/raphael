import { describe, it, expect } from 'vitest';
import type { Octokit } from '@octokit/core';
import { map$ } from 'kyrielle';
import type { PipeStep, SimpleIterator } from 'kyrielle';
import type { GqlConnection, GqlPageLoader, GqlPageQuery, GqlPage } from './octokit-paginator';
import { mapGqlConnection, octokitPaginator } from './octokit-paginator';

describe('mapGqlConnection', () => {
  it('maps null nodes to an empty array and preserves page info', () => {
    const conn: GqlConnection<number> = {
      nodes: null,
      totalCount: 0,
      pageInfo: { endCursor: null, hasNextPage: false },
    };

    const mapper = map$((v: number) => v * 2) as PipeStep<
      readonly number[],
      SimpleIterator<number>
    >;

    const result = mapGqlConnection(conn, mapper);
    expect(result.nodes).toEqual([]);
    expect(result.endCursor).toBeNull();
    expect(result.hasNextPage).toBe(false);
    expect(result.totalCount).toBe(0);
  });

  it('applies the mapper to nodes and preserves metadata', () => {
    const conn: GqlConnection<number> = {
      nodes: [1, 2, 3],
      totalCount: 3,
      pageInfo: { endCursor: 'end', hasNextPage: false },
    };

    const mapper = map$((v: number) => v * 2) as PipeStep<
      readonly number[],
      SimpleIterator<number>
    >;

    const result = mapGqlConnection(conn, mapper);
    expect(result.nodes).toEqual([2, 4, 6]);
    expect(result.endCursor).toEqual('end');
    expect(result.hasNextPage).toBe(false);
    expect(result.totalCount).toBe(3);
  });
});

describe('octokitPaginator', () => {
  it('yields items across multiple pages in order and passes after between calls', async () => {
    const pages: GqlPage<number>[] = [
      { nodes: [1, 2], endCursor: 'c1', hasNextPage: true, totalCount: 4 },
      { nodes: [3, 4], endCursor: null, hasNextPage: false, totalCount: 4 },
    ];

    const afters: Array<string | null> = [];
    let callIndex = 0;

    const loader: GqlPageLoader<GqlPageQuery, number> = async (
      _octokit: Octokit,
      query: GqlPageQuery,
    ) => {
      afters.push(query.after ?? null);
      // return next page in sequence
      return pages[callIndex++];
    };

    const collected: number[] = [];
    const octokit = {} as Octokit;
    for await (const v of octokitPaginator(octokit, loader, { first: 2 })) {
      collected.push(v);
    }

    expect(collected).toEqual([1, 2, 3, 4]);
    // first call: after null, second call: after 'c1'
    expect(afters).toEqual([null, 'c1']);
  });

  it('uses default first=100 when query.first is undefined', async () => {
    let capturedFirst: number | undefined = undefined;

    const loader: GqlPageLoader<GqlPageQuery, number> = async (
      octokit: Octokit,
      query: GqlPageQuery,
    ) => {
      capturedFirst = query.first as number | undefined;
      return { nodes: [], endCursor: null, hasNextPage: false, totalCount: 0 };
    };

    const collected: number[] = [];
    const octokit = {} as Octokit;
    for await (const v of octokitPaginator(octokit, loader, { after: null })) {
      collected.push(v);
    }

    expect(capturedFirst).toBe(100);
    expect(collected).toEqual([]);
  });

  it('yields nothing for an empty page and stops when hasNextPage is false', async () => {
    const loader: GqlPageLoader<GqlPageQuery, number> = async () => {
      return { nodes: [], endCursor: null, hasNextPage: false, totalCount: 0 };
    };

    const collected: number[] = [];
    const octokit = {} as Octokit;
    for await (const v of octokitPaginator(octokit, loader, {})) {
      collected.push(v);
    }

    expect(collected).toEqual([]);
  });
});
