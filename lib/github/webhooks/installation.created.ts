import { app } from '@/lib/github/octokit.app';
import { getRepository } from '@/lib/github/repositories/get-repository';
import { splitRepositoryFullName } from '@/lib/github/repositories/utils';
import prisma from '@/lib/prisma.client';
import type { InstallationCreateInput } from '@/lib/prisma/models/Installation';
import type { RepositoriesOnInstallationsCreateWithoutInstallationInput } from '@/lib/prisma/models/RepositoriesOnInstallations';
import type { EmitterWebhookEvent } from '@octokit/webhooks';

export async function installationCreatedHook({
  payload,
}: EmitterWebhookEvent<'installation.created'>) {
  const octokit = await app.getInstallationOctokit(payload.installation.id);
  const data: InstallationCreateInput = {
    id: payload.installation.id,
  };

  // Add repositories
  if (payload.repositories) {
    const repositories: Promise<RepositoriesOnInstallationsCreateWithoutInstallationInput>[] = [];

    for (const repository of payload.repositories) {
      const { owner, name } = splitRepositoryFullName(repository.full_name);

      repositories.push(
        (async () => {
          const data = await getRepository(octokit, owner, name);

          return {
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
          };
        })(),
      );
    }

    data.repositories = { create: await Promise.all(repositories) };
  }

  await prisma.installation.create({ data });
}
