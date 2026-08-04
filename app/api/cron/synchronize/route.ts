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
        // Update database
        const actual = await prisma.repository.upsert({
          where: {
            fullName: { owner, name },
          },
          update: {
            issueCount,
          },
          create: {
            owner,
            name,
            issueCount,
          },
        });

        // Update pull request count and individual PR records
        const actualPushedAt = actual.pushedAt ? dayjs(actual.pushedAt).toISOString() : null;

        if (actualPushedAt !== pushedAt) {
          const data = await graphql(octokit, SynchronizeRepository, { owner, name });
          const pullRequestCount = data.repository?.pullRequests?.totalCount ?? 0;
          const pullRequests = data.repository?.pullRequests?.nodes ?? [];

          // Upsert individual PR records
          for (const pr of pullRequests) {
            if (!pr || !pr.author) {
              continue;
            }

            await prisma.pullRequest.upsert({
              where: {
                fullNumber: {
                  repositoryOwner: owner,
                  repositoryName: name,
                  number: pr.number,
                },
              },
              update: {
                title: pr.title,
                state: pr.state,
                author: pr.author.login,
                updatedAt: dayjs(pr.updatedAt).toDate(),
              },
              create: {
                repositoryOwner: owner,
                repositoryName: name,
                number: pr.number,
                title: pr.title,
                state: pr.state,
                author: pr.author.login,
                htmlUrl: pr.url,
                createdAt: dayjs(pr.createdAt).toDate(),
                updatedAt: dayjs(pr.updatedAt).toDate(),
              },
            });
          }

          await prisma.repository.update({
            where: {
              fullName: { owner, name },
            },
            data: {
              pushedAt,
              pullRequestCount,
            },
          });
        }
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
      pullRequests(first: 100, states: [OPEN]) {
        totalCount
        nodes {
          id
          number
          title
          state
          url
          author {
            login
          }
          createdAt
          updatedAt
        }
      }
    }
  }
`;
