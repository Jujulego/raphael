import type { Octokit } from '@octokit/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { graphql } from '@/lib/utils/graphql';
import { listPullRequests } from './list-pull-requests';

vi.mock('@/lib/utils/graphql', () => ({
  graphql: vi.fn(),
}));

describe('listPullRequests', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('maps closedAt for closed pull requests and preserves null for open ones', async () => {
    const closedAt = '2026-10-05T12:00:00Z';
    const response = {
      repository: {
        id: 'repository-id',
        pullRequests: {
          totalCount: 2,
          nodes: [
            {
              id: 'closed-pr',
              number: 1,
              title: 'Closed pull request',
              state: 'CLOSED',
              url: 'https://github.com/owner/repo/pull/1',
              createdAt: '2026-10-01T12:00:00Z',
              updatedAt: closedAt,
              closedAt,
              author: { login: 'author' },
            },
            {
              id: 'open-pr',
              number: 2,
              title: 'Open pull request',
              state: 'OPEN',
              url: 'https://github.com/owner/repo/pull/2',
              createdAt: '2026-10-02T12:00:00Z',
              updatedAt: '2026-10-03T12:00:00Z',
              closedAt: null,
              author: { login: 'author' },
            },
          ],
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
        },
      },
    };
    vi.mocked(graphql).mockResolvedValue(response);

    const result = await listPullRequests({} as Octokit, { owner: 'owner', repo: 'repo' });

    expect(result.nodes.map(({ closedAt: date }) => date)).toEqual([closedAt, null]);
  });
});
