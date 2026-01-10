import prisma from '@/lib/prisma.client';
import { userRepositories } from '@/lib/repositories/UserRepositories';
import { flush, logger, withMonitor } from '@sentry/nextjs';
import { revalidateTag } from 'next/cache';
import { after } from 'next/server';

export async function GET(req: Request) {
  after(() => flush());

  const token = req.headers.get('Authorization');

  if (token !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  await withMonitor(
    'synchronize',
    async () => {
      const promises: Promise<unknown>[] = [];
      // const ids = new Set<string>();

      for await (const repository of userRepositories({ login: 'jujulego' })) {
        logger.info(`Upserting repository ${repository.id}`);
        // ids.add(repository.id);

        promises.push(
          prisma.repository.upsert({
            where: {
              owner_name: {
                owner: repository.owner.login,
                name: repository.name,
              },
            },
            update: {
              name: repository.name,
              owner: repository.owner.login,
              issueCount: repository.issues.totalCount,
              pullRequestCount: repository.pullRequests.totalCount,
            },
            create: {
              name: repository.name,
              owner: repository.owner.login,
              issueCount: repository.issues.totalCount,
              pullRequestCount: repository.pullRequests.totalCount,
            },
          }),
        );
      }

      await Promise.all(promises);

      // Remove old ones
      // await prisma.repository.deleteMany({
      //   where: {
      //     NOT: {
      //       id: { in: Array.from(ids) },
      //     },
      //   },
      // });

      revalidateTag('repositories', 'max');
    },
    {
      schedule: {
        type: 'crontab',
        value: '0 0 * * *',
      },
      checkinMargin: 60,
      maxRuntime: 15,
    },
  );

  return new Response();
}
