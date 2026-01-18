import prisma from '@/lib/prisma.client';
import type { InstallationCreateInput } from '@/lib/prisma/models/Installation';
import type { RepositoriesOnInstallationsCreateWithoutInstallationInput } from '@/lib/prisma/models/RepositoriesOnInstallations';
import type { EmitterWebhookEvent } from '@octokit/webhooks';

export async function installationCreatedHook({
  payload,
}: EmitterWebhookEvent<'installation.created'>) {
  const data: InstallationCreateInput = {
    id: payload.installation.id,
  };

  // Add repositories
  if (payload.repositories) {
    const repositories: RepositoriesOnInstallationsCreateWithoutInstallationInput[] = [];

    for (const repository of payload.repositories) {
      const [owner, name] = repository.full_name.split('/');

      repositories.push({
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

    data.repositories = { create: repositories };
  }

  await prisma.installation.create({ data });
}
