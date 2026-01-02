import prisma from '@/lib/prisma.client';
import { loadUserRepositories } from '@/lib/repositories/repositories.gql';

export async function GET(req: Request) {
  const token = req.headers.get('Authorization');

  if (token !== process.env.CRON_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('Loading repositories');
  const repositories = await loadUserRepositories('jujulego');
  console.log(`Received ${repositories.length} repositories`);

  console.log('Updating database');
  for (const repository of repositories) {
    if (!repository) {
      continue;
    }

    await prisma.repository.upsert({
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
    });
  }

  return new Response();
}
