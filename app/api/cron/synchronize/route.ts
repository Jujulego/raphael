import { app } from '@/lib/github/octokit.app';
import { refreshRepository } from '@/lib/repositories/refresh-repository';
import { cron } from '@/lib/utils/cron';
import { startSpan } from '@sentry/nextjs';
import { revalidateTag } from 'next/cache';

export const GET = cron(
  async () => {
    const promises: Promise<unknown>[] = [];

    for await (const { octokit, repository } of app.eachRepository.iterator()) {
      const owner = repository.owner.login;
      const name = repository.name;

      promises.push(
        startSpan({ name: `synchronize repository ${owner}/${name}` }, async () => {
          await refreshRepository(octokit, owner, name);
        }).catch(() => {}),
      );
    }

    await Promise.all(promises);

    revalidateTag('repositories', 'max');
  },
  {
    slug: 'synchronize',
    schedule: {
      type: 'crontab',
      value: '0 0 * * *',
    },
    checkinMargin: 60,
    maxRuntime: 15,
  },
);
