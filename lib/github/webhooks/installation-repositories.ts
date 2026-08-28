import { app } from '@/lib/github/octokit.app';
import { listPullRequests } from '@/lib/github/pull-requests/list-pull-requests';
import { getRepository } from '@/lib/github/repositories/get-repository';
import { splitRepositoryFullName } from '@/lib/github/repositories/utils';
import { prisma } from '@/lib/prisma.client';
import type {
  RepositoriesOnInstallationsUpsertWithWhereUniqueWithoutInstallationInput as RepositoriesOnInstallationsUpsert,
  RepositoriesOnInstallationsWhereUniqueInput,
} from '@/lib/prisma/models/RepositoriesOnInstallations';
import type { PullRequestUpsertWithWhereUniqueWithoutRepositoryInput as PullRequestUpsert } from '@/lib/prisma/models/PullRequest';
import { paginator } from '@/lib/utils/paginate';
import type { EmitterWebhookEvent } from '@octokit/webhooks';
import dayjs from 'dayjs';
import { revalidateTag } from 'next/cache';

export async function installationRepositoriesHook({
  payload,
}: EmitterWebhookEvent<'installation_repositories'>) {
  const octokit = await app.getInstallationOctokit(payload.installation.id);

  // Added repositories
  const added: RepositoriesOnInstallationsUpsert[] = [];

  for (const repository of payload.repositories_added) {
    const { owner, name } = splitRepositoryFullName(repository.full_name);

    const data = await getRepository(octokit, owner, name);
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

    added.push({
      where: {
        installationId_repositoryOwner_repositoryName: {
          installationId: payload.installation.id,
          repositoryOwner: owner,
          repositoryName: name,
        },
      },
      update: {
        repository: {
          update: {
            where: {
              owner,
              name,
            },
            data: {
              pushedAt: data?.pushedAt,
              issueCount: data?.issueCount ?? 0,
              pullRequests: {
                upsert: pullRequests,
              },
            },
          },
        },
      },
      create: {
        repository: {
          connectOrCreate: {
            where: {
              fullName: {
                owner,
                name,
              },
            },
            create: {
              owner,
              name,
              pushedAt: data?.pushedAt,
              issueCount: data?.issueCount,
              pullRequests: {
                create: pullRequests.map((o) => o.create),
              },
            },
          },
        },
      },
    });
  }

  // Removed repositories
  const removed: RepositoriesOnInstallationsWhereUniqueInput[] = [];

  for (const repository of payload.repositories_removed) {
    if (!repository.full_name) continue;

    const [owner, name] = repository.full_name.split('/');

    removed.push({
      installationId_repositoryOwner_repositoryName: {
        installationId: payload.installation.id,
        repositoryOwner: owner,
        repositoryName: name,
      },
    });
  }

  // Apply update
  await prisma.installation.update({
    where: {
      id: payload.installation.id,
    },
    data: {
      repositories: {
        upsert: await Promise.all(added),
        delete: removed,
      },
    },
  });

  revalidateTag('repositories', 'max');
}
