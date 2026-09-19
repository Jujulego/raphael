import { prisma } from '@/lib/prisma.client';
import type { RepositoryStats } from '@/lib/prisma/client';
import type { RepositoryStatsOrderByWithRelationInput } from '@/lib/prisma/models/RepositoryStats';

export interface UserRepositoriesParams {
  readonly take?: number;
  readonly skip?: number;
  readonly orderBy?: RepositoryStatsOrderByWithRelationInput[];
}

export async function findUserRepositoriesStats(
  userId: string,
  params: UserRepositoriesParams = {},
): Promise<RepositoryStats[]> {
  return prisma.repositoryStats.findMany({
    ...params,
    where: {
      installations: {
        some: {
          installation: {
            account: {
              userId: userId,
            },
          },
        },
      },
    },
  });
}

export async function countUserRepositories(userId: string): Promise<number> {
  return prisma.repository.count({
    where: {
      installations: {
        some: {
          installation: {
            account: {
              userId: userId,
            },
          },
        },
      },
    },
  });
}
