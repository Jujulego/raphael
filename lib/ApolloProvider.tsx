'use client';

import { ApolloLink, HttpLink } from '@apollo/client';
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { type ReactNode, useCallback } from 'react';

export function ApolloProvider({ children, token }: ApolloProviderProps) {
  const makeClient = useCallback(() => {
    const httpLink = new HttpLink({
      uri: 'https://api.github.com/graphql',
    });

    const authMiddleware = new SetContextLink(async ({ headers }) => {
      return {
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`,
        },
      };
    });

    const errorMiddleware = new ErrorLink(({ error }) => {
      console.error(error);
    });

    return new ApolloClient({
      assumeImmutableResults: true,
      cache: new InMemoryCache(),
      link: ApolloLink.from([errorMiddleware, authMiddleware, httpLink]),
    });
  }, [token]);

  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}

export interface ApolloProviderProps {
  readonly children: ReactNode;
  readonly token: string;
}
