import prisma from '@/lib/prisma.client';
import type {
  RepositoriesOnInstallationsCreateWithoutInstallationInput,
  RepositoriesOnInstallationsWhereUniqueInput,
} from '@/lib/prisma/models/RepositoriesOnInstallations';
import type { EmitterWebhookEvent } from '@octokit/webhooks';

export async function installationRepositoriesHook({
  payload,
}: EmitterWebhookEvent<'installation_repositories'>) {
  const added: RepositoriesOnInstallationsCreateWithoutInstallationInput[] = [];
  const removed: RepositoriesOnInstallationsWhereUniqueInput[] = [];

  // Added repositories
  for (const repository of payload.repositories_added) {
    const [owner, name] = repository.full_name.split('/');

    added.push({
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
        create: added,
        delete: removed,
      },
    },
  });
}
