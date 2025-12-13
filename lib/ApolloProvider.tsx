'use client';

import { actGithubAppToken } from '@/lib/github.actions';
import { HttpLink } from '@apollo/client';
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';
import { SetContextLink } from '@apollo/client/link/context';
import type { ReactNode } from 'react';

export function ApolloProvider({ children }: ApolloProviderProps) {
  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}

export interface ApolloProviderProps {
  readonly children: ReactNode;
}

// Utils
function makeClient() {
  const httpLink = new HttpLink({
    uri: 'https://api.github.com/graphql',
  });

  const authLink = new SetContextLink(async ({ headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${await actGithubAppToken()}`,
      },
    };
  });

  return new ApolloClient({
    assumeImmutableResults: true,
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
  });
}
