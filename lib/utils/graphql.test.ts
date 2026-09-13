import type { Octokit } from '@octokit/core';
import { startSpan } from '@sentry/nextjs';
import { parse } from 'graphql';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { graphql } from './graphql';

vi.mock('@sentry/nextjs', () => ({
  startSpan: vi.fn(async (opts: unknown, fn: () => Promise<unknown>) => fn()),
}));

describe('graphql', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('calls startSpan and octokit.graphql for a named query without variables', async () => {
    const doc = parse('query MyQuery { viewer { login } }');

    const graphqlResult = { viewer: { login: 'julie' } };
    const octokit = {
      graphql: vi.fn(async () => {
        return graphqlResult;
      }),
    };

    const result = await graphql(octokit as unknown as Octokit, doc);

    expect(result).toBe(graphqlResult);

    expect(startSpan).toHaveBeenCalledExactlyOnceWith(
      {
        op: 'graphql',
        name: 'MyQuery',
        attributes: {
          'graphql.name': 'MyQuery',
          'graphql.type': 'query',
          'graphql.variables': undefined,
        },
      },
      expect.any(Function),
    );

    expect(octokit.graphql).toHaveBeenCalledExactlyOnceWith(
      expect.stringContaining('query MyQuery'),
      undefined,
    );
  });

  it('passes variables and includes them in attributes', async () => {
    const doc = parse('query MyQuery($id: ID!) { node(id: $id) { id } }');

    const graphqlResult = { node: { id: '1' } };
    const octokit = {
      graphql: vi.fn(async () => graphqlResult),
    };

    const vars = { id: '1' };
    const result = await graphql(octokit as unknown as Octokit, doc, vars);

    expect(result).toBe(graphqlResult);

    expect(startSpan).toHaveBeenCalledExactlyOnceWith(
      {
        op: 'graphql',
        name: 'MyQuery',
        attributes: {
          'graphql.name': 'MyQuery',
          'graphql.type': 'query',
          'graphql.variables': JSON.stringify(vars),
        },
      },
      expect.any(Function),
    );

    const graphqlMock = vi.mocked(octokit.graphql);
    expect(graphqlMock).toHaveBeenCalledWith(expect.any(String), vars);
  });

  it('uses <unnamed> when operation has no name', async () => {
    const doc = parse('{ viewer { login } }');
    const octokit = {
      graphql: vi.fn(async () => {
        return { viewer: { login: 'x' } };
      }),
    };

    await graphql(octokit as unknown as Octokit, doc);

    expect(startSpan).toHaveBeenCalledExactlyOnceWith(
      {
        op: 'graphql',
        name: '<unnamed>',
        attributes: {
          'graphql.name': '<unnamed>',
          'graphql.type': 'query',
          'graphql.variables': undefined,
        },
      },
      expect.any(Function),
    );
  });
});
