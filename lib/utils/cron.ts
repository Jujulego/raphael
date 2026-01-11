import type { MonitorConfig } from '@sentry/core';
import { flush, withMonitor } from '@sentry/nextjs';
import { after } from 'next/server';

export function cron(job: CronJob, { slug, ...config }: CronSetup) {
  return async (req: Request) => {
    after(() => flush());

    const token = req.headers.get('Authorization');

    if (token !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    await withMonitor(slug, job, config);

    return new Response();
  };
}

export type CronJob = () => PromiseLike<void> | void;

export interface CronSetup extends MonitorConfig {
  readonly slug: string;
}
