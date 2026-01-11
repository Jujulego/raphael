import { app } from '@/lib/github/octokit.app';
import prisma from '@/lib/prisma.client';
import type { RepoOpenPullCountQuery } from '@/lib/types/graphql';
import { cron } from '@/lib/utils/cron';
import { Prisma } from '@prisma/client/extension';
import { print } from 'graphql';
import gql from 'graphql-tag';
import { revalidateTag } from 'next/cache';

export const GET = cron(
  async () => {
    const operations: Prisma.PrismaPromise<unknown>[] = [];

    for await (const { octokit, repository } of app.eachRepository.iterator()) {
      const result = await octokit.graphql<RepoOpenPullCountQuery>(print(RepoOpenPullCount), {
        owner: repository.owner.login,
        name: repository.name,
      });

      operations.push(
        prisma.repository.update({
          where: {
            fullName: {
              owner: repository.owner.login,
              name: repository.name,
            },
          },
          data: {
            issueCount: repository.open_issues_count,
            pullRequestCount: result.repository!.pullRequests.totalCount,
          },
        }),
      );
    }

    await prisma.$transaction(operations);

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

const RepoOpenPullCount = gql`
  query RepoOpenPullCount($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      pullRequests(first: 0, states: [OPEN]) {
        totalCount
      }
    }
  }
`;
