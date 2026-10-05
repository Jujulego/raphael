'use client';

import Paper from '@mui/material/Paper';
import { LineChart } from '@mui/x-charts';
import { clsx } from 'clsx';
import dayjs from 'dayjs';
import { useMemo } from 'react';

export default function ActivityGraph({ className, data }: ActivityGraphProps) {
  const dateFormat = useMemo(() => {
    const first = data[0];
    const last = data[data.length - 1];

    if (dayjs(first.date).year() !== dayjs(last.date).year()) {
      return 'DD MMM YYYY';
    } else {
      return 'DD MMM';
    }
  }, [data]);

  return (
    <Paper className={clsx('flex flex-col', className)} component="article" sx={{ minHeight: 300 }}>
      <h6 className="mx-4 my-3 shrink-0">Repository Activity</h6>
      <LineChart
        className="grow"
        dataset={data}
        grid={{ horizontal: true }}
        series={[{ dataKey: 'pullRequests', label: 'Pull requests', area: true, showMark: true }]}
        slotProps={{
          area: {
            fillOpacity: 0.4,
          },
        }}
        xAxis={[
          {
            dataKey: 'date',
            label: 'Date',
            scaleType: 'point',
            valueFormatter: (date: Date) => dayjs(date).format(dateFormat),
          },
        ]}
        yAxis={[
          {
            scaleType: 'linear',
            tickMinStep: 1,
            domainLimit: 'nice',
            min: 0,
          },
        ]}
      />
    </Paper>
  );
}

export interface ActivityGraphProps {
  readonly className?: string;
  readonly data: readonly ActivityData[];
}

export type ActivityData = {
  readonly date: Date;
  readonly pullRequests: number;
};
