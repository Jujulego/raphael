import { prisma } from '@/lib/prisma.client';
import { PullRequestState } from '@/lib/prisma/enums';
import { aggPullRequestActivity } from '@/lib/prisma/sql/aggPullRequestActivity';
import { cacheLife } from 'next/cache';

export interface ActivityGraphParams {
  readonly repositoryOwner: string;
  readonly repositoryName: string;
  readonly startDate: Date;
  readonly endDate: Date;
}

export type ActivityData = {
  readonly date: Date;
  readonly pullRequests: number;
};

export async function getActivityGraphData(params: ActivityGraphParams): Promise<ActivityData[]> {
  'use cache';

  cacheLife('hours');

  const [finalCount, additions] = await Promise.all([
    prisma.pullRequest.count({
      where: {
        repositoryOwner: params.repositoryOwner,
        repositoryName: params.repositoryName,
        state: PullRequestState.OPEN,
        createdAt: {
          lte: params.endDate,
        },
      },
    }),
    prisma.$queryRawTyped(
      aggPullRequestActivity(
        params.repositoryOwner,
        params.repositoryName,
        params.startDate,
        params.endDate,
      ),
    ),
  ]);

  const data: ActivityData[] = [{ date: params.endDate, pullRequests: finalCount }];
  let prCount = finalCount;

  for (const add of additions) {
    prCount += (add.closed ?? 0) - (add.added ?? 0);
    data.push({ date: add.date!, pullRequests: prCount });
  }

  data.push({ date: params.startDate, pullRequests: prCount });

  data.reverse();

  return data;
}
