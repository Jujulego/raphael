import { mapToPullRequestState } from '@/lib/github/pull-requests/pull-request';
import { splitRepositoryFullName } from '@/lib/github/repositories/utils';
import { prisma } from '@/lib/prisma.client';
import type { EmitterWebhookEvent } from '@octokit/webhooks';
import dayjs from 'dayjs';
import { revalidateTag } from 'next/cache';

export async function pullRequestHook({
  payload: { repository, pull_request },
}: EmitterWebhookEvent<
  'pull_request.opened' | 'pull_request.edited' | 'pull_request.reopened' | 'pull_request.closed'
>) {
  const { owner, name } = splitRepositoryFullName(repository.full_name);
  const pushedAt = repository.pushed_at ? dayjs(repository.pushed_at).toISOString() : null;
  const state = mapToPullRequestState(pull_request.state, pull_request.merged);

  await Promise.all([
    await prisma.repository.update({
      where: {
        fullName: {
          owner,
          name,
        },
      },
      data: {
        issueCount: repository.open_issues_count,
        pushedAt,
      },
    }),
    await prisma.pullRequest.upsert({
      where: {
        fullNumber: {
          repositoryOwner: owner,
          repositoryName: name,
          number: pull_request.number,
        },
      },
      update: {
        title: pull_request.title,
        state,
        author: pull_request.user.login,
        updatedAt: dayjs(pull_request.updated_at).toDate(),
      },
      create: {
        repositoryOwner: owner,
        repositoryName: name,
        number: pull_request.number,
        title: pull_request.title,
        state,
        author: pull_request.user.login,
        createdAt: dayjs(pull_request.created_at).toDate(),
        updatedAt: dayjs(pull_request.updated_at).toDate(),
      },
    }),
  ]);

  revalidateTag('repositories', 'max');
}
