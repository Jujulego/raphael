import { app } from '@/lib/github/octokit.app';
import { getRepository } from '@/lib/github/queries/get-repository';
import { splitRepositoryFullName } from '@/lib/utils/github';
import { prisma } from '@/lib/prisma.client';
import type { InstallationCreateInput } from '@/lib/prisma/models/Installation';
import type { RepositoriesOnInstallationsCreateWithoutInstallationInput } from '@/lib/prisma/models/RepositoriesOnInstallations';
import type { EmitterWebhookEvent } from '@octokit/webhooks';
import { revalidateTag } from 'next/cache';

export async function installationCreatedHook({
  payload,
}: EmitterWebhookEvent<'installation.created'>) {
  const octokit = await app.getInstallationOctokit(payload.installation.id);
  const data: InstallationCreateInput = {
    id: payload.installation.id,
    account: payload.installation.account
      ? {
          connect: {
            issuer_accountId: {
              accountId: payload.installation.account?.id?.toString(),
              issuer: 'local:oauth:github',
            },
          },
        }
      : undefined,
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

  revalidateTag('repositories', 'max');
}
