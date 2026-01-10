import type {
  FindUserRepositoriesQuery,
  FindUserRepositoriesQueryVariables,
  RepositoryItemFragment,
  RepositoryPageFragment,
} from '@/lib/types/graphql';
import type { TypedDocumentNode } from '@apollo/client';
import gql from 'graphql-tag';
import { getClient } from '../apollo.client';
import { RepositoryPage } from './RepositoryPage';

/**
 * Loads one page of user's repositories.
 */
export async function findUserRepositories(
  variables: FindUserRepositoriesQueryVariables,
): Promise<RepositoryPageFragment> {
  const client = getClient();
  const result = await client.query({ query: FindUserRepositories, variables });

  if (!result.data) {
    throw new Error('Error while loading user repositories', { cause: result.error });
  }

  if (!result.data.user) {
    throw new Error(`User ${variables.login} not found`);
  }

  return result.data.user.repositories;
}

/**
 * Iterates over all user's repositories
 */
export async function* userRepositories(
  variables: Omit<FindUserRepositoriesQueryVariables, 'cursor'>,
): AsyncGenerator<RepositoryItemFragment, void> {
  let cursor: string | null = null;

  while (true) {
    const page = await findUserRepositories({ ...variables, cursor });

    for (const edge of page.edges ?? []) {
      if (edge?.node) {
        yield edge.node;
      }
    }

    if (!page.pageInfo.hasNextPage) {
      break;
    }

    cursor = page.pageInfo.endCursor;
  }
}

// Query
const FindUserRepositories: TypedDocumentNode<
  FindUserRepositoriesQuery,
  FindUserRepositoriesQueryVariables
> = gql`
  query FindUserRepositories($login: String!, $cursor: String) {
    user(login: $login) {
      id
      repositories(after: $cursor, first: 100) {
        ...RepositoryPage
      }
    }
  }

  ${RepositoryPage}
`;
