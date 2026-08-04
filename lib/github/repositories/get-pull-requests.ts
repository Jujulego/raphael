import { graphql } from '@/lib/utils/graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { Octokit } from '@octokit/core';
import gql from 'graphql-tag';

interface PullRequestData {
  readonly number: number;
  readonly title: string;
  readonly state: string;
  readonly author: string;
  readonly htmlUrl: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export async function getPullRequests(
  octokit: Octokit,
  owner: string,
  name: string,
  states: ('OPEN' | 'CLOSED' | 'MERGED')[] = ['OPEN'],
): Promise<PullRequestData[]> {
  const data = await graphql(octokit, GetPullRequests, {
    owner,
    name,
    states: states as string[],
  });

  if (!data.repository?.pullRequests?.nodes) {
    return [];
  }

  return data.repository.pullRequests.nodes.map((pr) => ({
    number: pr.number,
    title: pr.title,
    state: pr.state,
    author: pr.author?.login ?? 'unknown',
    htmlUrl: pr.url,
    createdAt: new Date(pr.createdAt),
    updatedAt: new Date(pr.updatedAt),
  }));
}

// Query
const GetPullRequests: TypedDocumentNode<any, any> = gql`
  query PullRequests($owner: String!, $name: String!, $states: [PullRequestState!]!) {
    repository(owner: $owner, name: $name) {
      id
      pullRequests(first: 100, states: $states) {
        nodes {
          number
          title
          state
          url
          author {
            login
          }
          createdAt
          updatedAt
        }
      }
    }
  }
`;
