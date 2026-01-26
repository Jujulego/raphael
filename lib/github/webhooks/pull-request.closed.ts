import { splitRepositoryFullName } from '@/lib/github/repositories/utils';
import prisma from '@/lib/prisma.client';
import type { EmitterWebhookEvent } from '@octokit/webhooks';
import dayjs from 'dayjs';
import { revalidateTag } from 'next/cache';

export async function pullRequestClosedHook({
  payload: { repository },
}: EmitterWebhookEvent<'pull_request.closed'>) {
  const { owner, name } = splitRepositoryFullName(repository.full_name);
  const pushedAt = repository.pushed_at ? dayjs(repository.pushed_at).toISOString() : null;

  await prisma.repository.update({
    where: {
      fullName: {
        owner,
        name,
      },
    },
    data: {
      issueCount: repository.open_issues_count,
      pullRequestCount: { decrement: 1 },
      pushedAt,
    },
  });

  revalidateTag('repositories', 'max');
}
