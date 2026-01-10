import prisma from '@/lib/prisma.client';
import type { InstallationCreateInput } from '@/lib/prisma/models/Installation';
import type { RepositoriesOnInstallationsCreateWithoutInstallationInput } from '@/lib/prisma/models/RepositoriesOnInstallations';
import type { EmitterWebhookEvent } from '@octokit/webhooks';

export async function installationCreatedHook({
  payload,
}: EmitterWebhookEvent<'installation.created'>) {
  let data: InstallationCreateInput;

  // Prepare installation data
  if (payload.installation.target_type === 'User') {
    const account = payload.installation.account;

    if (!account || !('login' in account)) {
      throw new Error('Event installation created misses an user account');
    }

    data = {
      id: payload.installation.id,
      target_id: payload.installation.target_id,
      target_type: 'User',
      target_login: account.login,
    };
  } else {
    throw new Error(`Installation on ${payload.installation.target_type} not yet supported`);
  }

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
