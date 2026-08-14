import { app } from '@/lib/github/octokit.app';
import { listPullRequests } from '@/lib/github/pull-requests/list-pull-requests';
import prisma from '@/lib/prisma.client';
import type { PullRequestUpsertWithWhereUniqueWithoutRepositoryInput as PullRequestUpsert } from '@/lib/prisma/models/PullRequest';
import { cron } from '@/lib/utils/cron';
import { paginator } from '@/lib/utils/paginate';
import { startSpan } from '@sentry/nextjs';
import dayjs from 'dayjs';
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
          const pullRequests: PullRequestUpsert[] = [];

          // Upsert individual PR records
          for await (const pr of paginator(listPullRequests, octokit, { owner, repo: name })) {
            pullRequests.push({
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
                author: pr.author,
                updatedAt: dayjs(pr.updatedAt).toDate(),
              },
              create: {
                number: pr.number,
                title: pr.title,
                state: pr.state,
                author: pr.author,
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
              pullRequests: {
                upsert: pullRequests,
              },
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
