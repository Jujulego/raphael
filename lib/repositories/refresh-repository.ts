import prisma from '@/lib/prisma.client';
import type { RefreshRepositoryQuery, RefreshRepositoryQueryVariables } from '@/lib/types/graphql';
import { graphql } from '@/lib/utils/graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { Octokit } from '@octokit/core';
import { logger } from '@sentry/nextjs';
import gql from 'graphql-tag';
import { revalidateTag } from 'next/cache';

export async function refreshRepository(octokit: Octokit, owner: string, name: string) {
  logger.info(`Refreshing repository ${owner}/${name}`);

  const data = await graphql(octokit, RefreshRepository, { owner, name });

  await prisma.repository.upsert({
    where: {
      fullName: { owner, name },
    },
    update: {
      issueCount: data.repository!.issues.totalCount,
      pullRequestCount: data.repository!.pullRequests.totalCount,
      pushedAt: data.repository!.pushedAt!,
    },
    create: {
      owner,
      name,
      issueCount: data.repository!.issues.totalCount,
      pullRequestCount: data.repository!.pullRequests.totalCount,
      pushedAt: data.repository!.pushedAt!,
    },
  });

  revalidateTag(`repository:${owner}/${name}`, 'max');
}

// Query
const RefreshRepository: TypedDocumentNode<
  RefreshRepositoryQuery,
  RefreshRepositoryQueryVariables
> = gql`
  query RefreshRepository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      pushedAt
      issues(first: 0, states: [OPEN]) {
        totalCount
      }
      pullRequests(first: 0, states: [OPEN]) {
        totalCount
      }
    }
  }
`;
