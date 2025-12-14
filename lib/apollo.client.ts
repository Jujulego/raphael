import { githubAppToken } from '@/lib/github.auth';
import { ApolloLink, HttpLink } from '@apollo/client';
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs';
import { ServerError } from '@apollo/client/errors';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  const httpLink = new HttpLink({
    uri: 'https://api.github.com/graphql',
  });

  const authMiddleware = new SetContextLink(async ({ headers }) => {
    const { token } = await githubAppToken();

    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
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
    cache: new InMemoryCache(),
    link: ApolloLink.from([errorMiddleware, authMiddleware, httpLink]),
  });
});
