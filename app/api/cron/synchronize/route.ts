import { app } from '@/lib/github/octokit.app';
import prisma from '@/lib/prisma.client';
import type {
  SynchronizeRepositoryQuery,
  SynchronizeRepositoryQueryVariables,
} from '@/lib/types/graphql';
import { cron } from '@/lib/utils/cron';
import { graphql } from '@/lib/utils/graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { startSpan } from '@sentry/nextjs';
import dayjs from 'dayjs';
import gql from 'graphql-tag';
import { revalidateTag } from 'next/cache';

export const GET = cron(
  async () => {
    const promises: Promise<unknown>[] = [];

    for await (const { octokit, repository } of app.eachRepository.iterator()) {
      const owner = repository.owner.login;
      const name = repository.name;
      const issueCount = repository.open_issues_count;
      const pushedAt = repository.pushed_at ? dayjs(repository.pushed_at).toISOString() : null;

      const prom = startSpan({ name: `synchronize repository ${owner}/${name}` }, async () => {
        const data = await graphql(octokit, SynchronizeRepository, { owner, name });
        const pullRequestCount = data.repository?.pullRequests?.totalCount ?? 0;

        // Update database
        await prisma.repository.upsert({
          where: {
            fullName: { owner, name },
          },
          update: {
            issueCount,
            pullRequestCount,
            pushedAt,
          },
          create: {
            owner,
            name,
            issueCount,
            pullRequestCount,
            pushedAt,
          },
        });
      });

      promises.push(prom.catch(() => {}));
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

// Query
const SynchronizeRepository: TypedDocumentNode<
  SynchronizeRepositoryQuery,
  SynchronizeRepositoryQueryVariables
> = gql`
  query SynchronizeRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      pullRequests(first: 0, states: [OPEN]) {
        totalCount
      }
    }
  }
`;
