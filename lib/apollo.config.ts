import { ApolloLink, HttpLink } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs';
import { ServerError } from '@apollo/client/errors';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { relayStylePagination } from '@apollo/client/utilities';

export function prepareClient(config: ApolloClientConfig) {
  const httpLink = new HttpLink({
    uri: 'https://api.github.com/graphql',
  });

  const authMiddleware = new SetContextLink(async ({ headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${await config.token()}`,
      },
    };
  });

  const errorMiddleware = new ErrorLink(({ error }) => {
    if (error instanceof ServerError) {
      console.error(
        `[apollo] Received error: ${error.response.status} ${error.response.statusText}`,
        error.bodyText,
      );
    } else {
      console.error(error);
    }
  });

  return new ApolloClient({
    assumeImmutableResults: true,
    cache: new InMemoryCache({
      typePolicies: {
        User: {
          fields: {
            repositories: relayStylePagination([
              'affiliations',
              'hasIssuesEnabled',
              'isArchived',
              'isFork',
              'isLocked',
              'orderBy',
              'ownerAffiliations',
              'privacy',
              'visibility',
            ]),
          },
        },
      },
    }),
    link: ApolloLink.from([errorMiddleware, authMiddleware, httpLink]),
  });
}

export interface ApolloClientConfig {
  token(): Promise<string> | string;
}
