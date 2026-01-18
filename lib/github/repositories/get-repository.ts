import { splitRepositoryFullName } from '@/lib/github/repositories/utils';
import type { RepositoryQuery, RepositoryQueryVariables } from '@/lib/types/graphql';
import { graphql } from '@/lib/utils/graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { Octokit } from '@octokit/core';
import gql from 'graphql-tag';

export async function getRepository(
  octokit: Octokit,
  owner: string,
  name: string,
): Promise<RepositoryData | null> {
  const data = await graphql(octokit, Repository, { owner, name });

  if (!data.repository) {
    return null;
  }

  return {
    ...splitRepositoryFullName(data.repository.nameWithOwner),
    pushedAt: data.repository.pushedAt,
    issueCount: data.repository.issues.totalCount,
    pullRequestCount: data.repository.pullRequests.totalCount,
  };
}

// Types
export interface RepositoryData {
  readonly owner: string;
  readonly name: string;
  readonly pushedAt: string | null;
  readonly issueCount: number;
  readonly pullRequestCount: number;
}

// Query
const Repository: TypedDocumentNode<RepositoryQuery, RepositoryQueryVariables> = gql`
  query Repository($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      id
      nameWithOwner
      pushedAt
      issues(states: [OPEN]) {
        totalCount
      }
      pullRequests(states: [OPEN]) {
        totalCount
      }
    }
  }
`;
