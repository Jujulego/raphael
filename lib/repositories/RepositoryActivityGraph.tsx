import { prisma } from '@/lib/prisma.client';
import { PullRequestState } from '@/lib/prisma/enums';
import { aggPullRequestActivity } from '@/lib/prisma/sql/aggPullRequestActivity';
import ActivityGraph, {
  type ActivityData,
  type ActivityGraphProps,
} from '@/lib/repositories/ui/ActivityGraph';
import dayjs from 'dayjs';
import { connection } from 'next/server';

export default async function RepositoryActivityGraph(props: RepositoryActivityGraphProps) {
  const { owner, name, ...rest } = props;
  await connection();

  const today = dayjs().startOf('day');
  const lastMonth = dayjs().subtract(1, 'month').startOf('day');

  const [finalCount, additions] = await Promise.all([
    prisma.pullRequest.count({
      where: {
        repositoryOwner: owner,
        repositoryName: name,
        state: PullRequestState.OPEN,
      },
    }),
    prisma.$queryRawTyped(aggPullRequestActivity(owner, name, lastMonth.toDate())),
  ]);

  let prCount = finalCount;

  const data: ActivityData[] = [{ date: today.toDate(), pullRequests: prCount }];

  for (const add of additions) {
    prCount += (add.closed ?? 0) - (add.added ?? 0);
    data.push({ date: add.date!, pullRequests: prCount });
  }

  data.reverse();

  return <ActivityGraph {...rest} data={data} />;
}

export interface RepositoryActivityGraphProps extends Omit<ActivityGraphProps, 'data'> {
  readonly owner: string;
  readonly name: string;
}
