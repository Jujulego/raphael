import { getActivityGraphData } from '@/lib/repositories/data/activity-graph';
import ActivityGraph, { type ActivityGraphProps } from '@/lib/repositories/ui/ActivityGraph';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { cacheLife } from 'next/cache';

dayjs.extend(utc);

export default async function RepositoryActivityGraph(props: RepositoryActivityGraphProps) {
  'use cache';

  cacheLife('hours');

  const { params, ...rest } = props;
  const { owner, name } = await params;

  const endDate = dayjs.utc().startOf('hour');
  const startDate = endDate.subtract(3, 'month');

  const data = await getActivityGraphData({
    repositoryOwner: owner,
    repositoryName: name,
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
  });

  return <ActivityGraph {...rest} data={data} />;
}

export interface RepositoryActivityGraphProps extends Omit<ActivityGraphProps, 'data'> {
  readonly params: Promise<{
    readonly owner: string;
    readonly name: string;
  }>;
}
