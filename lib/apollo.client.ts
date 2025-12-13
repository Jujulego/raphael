import { githubAppToken } from '@/lib/github.auth';
import { HttpLink } from '@apollo/client';
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs';
import { SetContextLink } from '@apollo/client/link/context';

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  const httpLink = new HttpLink({
    uri: 'https://api.github.com/graphql',
  });

  const authLink = new SetContextLink(async ({ headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${await githubAppToken()}`,
      },
    };
  });

  return new ApolloClient({
    assumeImmutableResults: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
});
