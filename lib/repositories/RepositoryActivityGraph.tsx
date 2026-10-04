import { prisma } from '@/lib/prisma.client';
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
      },
    }),
    prisma.pullRequest.groupBy({
      by: 'createdAt',
      _count: true,
      where: {
        repositoryOwner: owner,
        repositoryName: name,
        createdAt: {
          gte: lastMonth.toDate(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ]);

  let prCount = finalCount;

  const data: ActivityData[] = [{ date: today.toDate(), pullRequests: prCount }];

  for (const add of additions) {
    prCount -= add._count;
    data.push({ date: add.createdAt, pullRequests: prCount });
  }

  return <ActivityGraph {...rest} data={data} />;
}

export interface RepositoryActivityGraphProps extends Omit<ActivityGraphProps, 'data'> {
  readonly owner: string;
  readonly name: string;
}
