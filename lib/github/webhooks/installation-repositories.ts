import { app } from '@/lib/github/octokit.app';
import { getRepository } from '@/lib/github/repositories/get-repository';
import { splitRepositoryFullName } from '@/lib/github/repositories/utils';
import prisma from '@/lib/prisma.client';
import type {
  RepositoriesOnInstallationsUpsertWithWhereUniqueWithoutInstallationInput as RepositoriesOnInstallationsUpsert,
  RepositoriesOnInstallationsWhereUniqueInput,
} from '@/lib/prisma/models/RepositoriesOnInstallations';
import type { EmitterWebhookEvent } from '@octokit/webhooks';
import { revalidateTag } from 'next/cache';

export async function installationRepositoriesHook({
  payload,
}: EmitterWebhookEvent<'installation_repositories'>) {
  const octokit = await app.getInstallationOctokit(payload.installation.id);

  // Added repositories
  const added: Promise<RepositoriesOnInstallationsUpsert>[] = [];

  for (const repository of payload.repositories_added) {
    const { owner, name } = splitRepositoryFullName(repository.full_name);

    added.push(
      (async () => {
        const data = await getRepository(octokit, owner, name);

        return {
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
                  pullRequestCount: data?.pullRequestCount ?? 0,
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
                  pullRequestCount: data?.pullRequestCount,
                },
              },
            },
          },
        };
      })(),
    );
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
