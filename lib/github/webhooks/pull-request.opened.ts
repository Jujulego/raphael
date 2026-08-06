import { splitRepositoryFullName } from '@/lib/github/repositories/utils';
import prisma from '@/lib/prisma.client';
import type { EmitterWebhookEvent } from '@octokit/webhooks';
import dayjs from 'dayjs';
import { revalidateTag } from 'next/cache';

export async function pullRequestOpenedHook({
  payload: { repository, pull_request },
}: EmitterWebhookEvent<'pull_request.opened' | 'pull_request.reopened'>) {
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
      pullRequestCount: { increment: 1 },
      pushedAt,
      pullRequests: {
        upsert: {
          where: {
            fullNumber: {
              repositoryOwner: owner,
              repositoryName: name,
              number: pull_request.number,
            },
          },
          update: {
            title: pull_request.title,
            state: pull_request.state,
            author: pull_request.user.login,
            updatedAt: dayjs(pull_request.updated_at).toDate(),
          },
          create: {
            number: pull_request.number,
            title: pull_request.title,
            state: pull_request.state,
            author: pull_request.user.login,
            createdAt: dayjs(pull_request.created_at).toDate(),
            updatedAt: dayjs(pull_request.updated_at).toDate(),
          },
        },
      },
    },
  });

  revalidateTag('repositories', 'max');
}
