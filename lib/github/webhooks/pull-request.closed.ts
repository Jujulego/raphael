import { splitRepositoryFullName } from '@/lib/github/repositories/utils';
import prisma from '@/lib/prisma.client';
import type { EmitterWebhookEvent } from '@octokit/webhooks';
import { revalidateTag } from 'next/cache';

export async function pullRequestClosedHook({
  payload,
}: EmitterWebhookEvent<'pull_request.closed'>) {
  const { owner, name } = splitRepositoryFullName(payload.repository.full_name);

  await prisma.repository.update({
    where: {
      fullName: {
        owner,
        name,
      },
    },
    data: {
      pullRequestCount: { decrement: 1 },
    },
  });

  revalidateTag('repositories', 'max');
}
