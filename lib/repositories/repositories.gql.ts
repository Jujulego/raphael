import type {
  LoadUserRepositoriesQuery,
  LoadUserRepositoriesQueryVariables,
} from '@/types/graphql';
import type { TypedDocumentNode } from '@apollo/client';
import gql from 'graphql-tag';
import { getClient } from '../apollo.client';

export const LoadUserRepositories: TypedDocumentNode<
  LoadUserRepositoriesQuery,
  LoadUserRepositoriesQueryVariables
> = gql`
  query LoadUserRepositories($login: String!, $cursor: String) {
    user(login: $login) {
      id
      repositories(after: $cursor, first: 100) {
        nodes {
          id
          name
          owner {
            id
            login
          }
          issues {
            totalCount
          }
          pullRequests {
            totalCount
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export async function loadUserRepositories(login: string) {
  const client = getClient();
  const repositories = await client.query({ query: LoadUserRepositories, variables: { login } });

  return repositories.data?.user?.repositories?.nodes ?? [];
}
