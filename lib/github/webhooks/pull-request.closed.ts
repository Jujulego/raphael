import { splitRepositoryFullName } from '@/lib/github/repositories/utils';
import prisma from '@/lib/prisma.client';
import type { EmitterWebhookEvent } from '@octokit/webhooks';
import dayjs from 'dayjs';
import { revalidateTag } from 'next/cache';

export async function pullRequestClosedHook({
  payload: { repository, pull_request },
}: EmitterWebhookEvent<'pull_request.closed'>) {
  const { owner, name } = splitRepositoryFullName(repository.full_name);
  const pushedAt = repository.pushed_at ? dayjs(repository.pushed_at).toISOString() : null;

  await Promise.all([
    prisma.repository.update({
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
    }),
    prisma.pullRequest.update({
      where: {
        fullNumber: {
          repositoryOwner: owner,
          repositoryName: name,
          number: pull_request.number,
        },
      },
      data: {
        state: pull_request.state,
        updatedAt: dayjs(pull_request.updated_at).toDate(),
      },
    }),
  ]);

  revalidateTag('repositories', 'max');
}
