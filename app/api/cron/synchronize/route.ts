import prisma from '@/lib/prisma.client';
import { userRepositories } from '@/lib/repositories/UserRepositories';
import { revalidateTag } from 'next/cache';

export async function GET(req: Request) {
  const token = req.headers.get('Authorization');

  if (token !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const promises: Promise<unknown>[] = [];

  for await (const repository of userRepositories({ login: 'jujulego' })) {
    promises.push(
      prisma.repository.upsert({
        where: {
          id: repository.id,
        },
        update: {
          name: repository.name,
          owner: repository.owner.login,
          issueCount: repository.issues.totalCount,
          pullRequestCount: repository.pullRequests.totalCount,
        },
        create: {
          id: repository.id,
          name: repository.name,
          owner: repository.owner.login,
          issueCount: repository.issues.totalCount,
          pullRequestCount: repository.pullRequests.totalCount,
        },
      }),
    );
  }

  await Promise.all(promises);

  revalidateTag('repositories', 'max');

  return new Response();
}
