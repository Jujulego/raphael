import { prisma } from '@/lib/prisma.client';
import { PullRequestState } from '@/lib/prisma/enums';
import { aggPullRequestActivity } from '@/lib/prisma/sql/aggPullRequestActivity';
import ActivityGraph, {
  type ActivityData,
  type ActivityGraphProps,
} from '@/lib/repositories/ui/ActivityGraph';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { connection } from 'next/server';

dayjs.extend(utc);

export default async function RepositoryActivityGraph(props: RepositoryActivityGraphProps) {
  const { owner, name, ...rest } = props;
  await connection();

  const endDate = dayjs.utc().startOf('hour');
  const startDate = endDate.subtract(3, 'month');

  const [finalCount, additions] = await Promise.all([
    prisma.pullRequest.count({
      where: {
        repositoryOwner: owner,
        repositoryName: name,
        state: PullRequestState.OPEN,
        createdAt: {
          lte: endDate.toDate(),
        },
      },
    }),
    prisma.$queryRawTyped(
      aggPullRequestActivity(owner, name, startDate.toDate(), endDate.toDate()),
    ),
  ]);

  const data: ActivityData[] = [{ date: endDate.toDate(), pullRequests: finalCount }];
  let prCount = finalCount;

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
