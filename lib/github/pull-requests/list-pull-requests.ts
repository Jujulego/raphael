import type { PullRequestData } from '@/lib/github/pull-requests/pull-request';
import type { ListPullRequestsQuery, ListPullRequestsQueryVariables } from '@/lib/types/graphql';
import { graphql } from '@/lib/utils/graphql';
import { mapConnection, type Page } from '@/lib/utils/paginate';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { Octokit } from '@octokit/core';
import gql from 'graphql-tag';
import { filter$, map$, step$ } from 'kyrielle';

export async function listPullRequests(
  octokit: Octokit,
  query: ListPullRequestsQueryVariables,
): Promise<Page<PullRequestData>> {
  const data = await graphql(octokit, ListPullRequests, query);

  if (!data.repository?.pullRequests) {
    return { nodes: [], endCursor: null, hasNextPage: false, totalCount: 0 };
  }

  return mapConnection(
    data.repository.pullRequests,
    step$(
      filter$((node) => !!node),
      map$((node): PullRequestData => ({
        repositoryOwner: query.owner,
        repositoryName: query.repo,
        number: node.number,
        title: node.title,
        state: node.state,
        author: node.author!.login,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
      })),
    ),
  );
}

// Query
const ListPullRequests: TypedDocumentNode<ListPullRequestsQuery, ListPullRequestsQueryVariables> =
  gql`
    query ListPullRequests($owner: String!, $repo: String!, $first: Int, $after: String) {
      repository(owner: $owner, name: $repo) {
        id
        pullRequests(first: $first, after: $after) {
          totalCount
          nodes {
            id
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
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  `;
