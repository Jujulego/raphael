import prisma from '@/lib/prisma.client';
import type {
  RepositoriesOnInstallationsUpsertWithWhereUniqueWithoutInstallationInput,
  RepositoriesOnInstallationsWhereUniqueInput,
} from '@/lib/prisma/models/RepositoriesOnInstallations';
import type { EmitterWebhookEvent } from '@octokit/webhooks';

export async function installationRepositoriesHook({
  payload,
}: EmitterWebhookEvent<'installation_repositories'>) {
  const added: RepositoriesOnInstallationsUpsertWithWhereUniqueWithoutInstallationInput[] = [];
  const removed: RepositoriesOnInstallationsWhereUniqueInput[] = [];

  // Added repositories
  for (const repository of payload.repositories_added) {
    const [owner, name] = repository.full_name.split('/');
    const data = {
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
          },
        },
      },
    };

    added.push({
      where: {
        installationId_repositoryOwner_repositoryName: {
          installationId: payload.installation.id,
          repositoryOwner: owner,
          repositoryName: name,
        },
      },
      update: data,
      create: data,
    });
  }

  // Removed repositories
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
        upsert: added,
        delete: removed,
      },
    },
  });
}
