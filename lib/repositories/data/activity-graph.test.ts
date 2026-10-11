import { prisma } from '@/lib/prisma.client';
import { PullRequestState } from '@/lib/prisma/enums';
import { aggPullRequestActivity } from '@/lib/prisma/sql/aggPullRequestActivity';
import {
  type ActivityGraphParams,
  getActivityGraphData,
} from '@/lib/repositories/data/activity-graph';
import { cacheLife } from 'next/cache';
import { describe, expect, vi, it } from 'vitest';

vi.mock('@/lib/prisma/sql/aggPullRequestActivity', () => ({
  aggPullRequestActivity: vi.fn(() => ({ sql: 'aggPullRequestActivity', values: [] })),
}));

describe('getActivityGraphData', () => {
  it('should return only start and end dates as no data matches', async () => {
    vi.mocked(prisma.pullRequest.count).mockResolvedValue(0);
    vi.mocked(prisma.$queryRawTyped).mockResolvedValue([]);

    const params: ActivityGraphParams = {
      repositoryOwner: 'owner',
      repositoryName: 'repo',
      startDate: new Date('2026-09-11'),
      endDate: new Date('2026-10-11'),
    };

    await expect(getActivityGraphData(params)).resolves.toEqual([
      { date: new Date('2026-09-11'), pullRequests: 0 },
      { date: new Date('2026-10-11'), pullRequests: 0 },
    ]);

    expect(cacheLife).toHaveBeenCalledWith('hours');

    expect(prisma.pullRequest.count).toHaveBeenCalledExactlyOnceWith({
      where: {
        repositoryOwner: params.repositoryOwner,
        repositoryName: params.repositoryName,
        state: PullRequestState.OPEN,
        createdAt: {
          lte: params.endDate,
        },
      },
    });

    expect(aggPullRequestActivity).toHaveBeenCalledWith(
      params.repositoryOwner,
      params.repositoryName,
      params.startDate,
      params.endDate,
    );
    expect(prisma.$queryRawTyped).toHaveBeenCalledExactlyOnceWith({
      sql: 'aggPullRequestActivity',
      values: [],
    });
  });

  it('should reformat data received from database', async () => {
    vi.mocked(prisma.pullRequest.count).mockResolvedValue(1);
    vi.mocked(prisma.$queryRawTyped).mockResolvedValue([
      { date: new Date('2026-09-25'), added: 0, closed: 2 },
      { date: new Date('2026-09-20'), added: 1, closed: 3 },
      { date: new Date('2026-09-15'), added: 2, closed: 1 },
    ]);

    const params: ActivityGraphParams = {
      repositoryOwner: 'owner',
      repositoryName: 'repo',
      startDate: new Date('2026-09-11'),
      endDate: new Date('2026-10-11'),
    };

    await expect(getActivityGraphData(params)).resolves.toEqual([
      { date: new Date('2026-09-11'), pullRequests: 4 },
      { date: new Date('2026-09-15'), pullRequests: 4 },
      { date: new Date('2026-09-20'), pullRequests: 5 },
      { date: new Date('2026-09-25'), pullRequests: 3 },
      { date: new Date('2026-10-11'), pullRequests: 1 },
    ]);

    expect(cacheLife).toHaveBeenCalledWith('hours');

    expect(prisma.pullRequest.count).toHaveBeenCalledExactlyOnceWith({
      where: {
        repositoryOwner: params.repositoryOwner,
        repositoryName: params.repositoryName,
        state: PullRequestState.OPEN,
        createdAt: {
          lte: params.endDate,
        },
      },
    });

    expect(aggPullRequestActivity).toHaveBeenCalledWith(
      params.repositoryOwner,
      params.repositoryName,
      params.startDate,
      params.endDate,
    );
    expect(prisma.$queryRawTyped).toHaveBeenCalledExactlyOnceWith({
      sql: 'aggPullRequestActivity',
      values: [],
    });
  });
});
