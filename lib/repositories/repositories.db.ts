import type { RepositoryData } from '@/lib/github/repositories/repository';
import prisma from '@/lib/prisma.client';
import type { RepositoryOrderByWithRelationInput } from '@/lib/prisma/models/Repository';

export async function listRepositories({
  orderBy,
}: ListRepositoriesParams): Promise<RepositoryData[]> {
  const data = await prisma.repository.findMany({
    orderBy,
    include: {
      _count: {
        select: {
          pullRequests: {
            where: {
              state: 'OPEN',
            },
          },
        },
      },
    },
  });

  return data.map((repository): RepositoryData => ({
    ...repository,
    pushedAt: repository.pushedAt?.toISOString() ?? null,
    pullRequestCount: repository._count.pullRequests,
  }));
}

export interface ListRepositoriesParams {
  readonly orderBy?: RepositoryOrderByWithRelationInput[];
}
