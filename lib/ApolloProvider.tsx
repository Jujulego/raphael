'use client';

import { actGithubReadonlyToken } from '@/lib/github.actions';
import { ApolloNextAppProvider } from '@apollo/client-integration-nextjs';
import type { InstallationAccessTokenAuthentication } from '@octokit/auth-app';
import { type ReactNode, useCallback } from 'react';
import { prepareClient } from './apollo.config';

export function ApolloProvider({ children, token }: ApolloProviderProps) {
  const makeClient = useCallback(() => {
    let actual = token;

    return prepareClient({
      async token() {
        if (new Date(actual.expiresAt).getTime() <= Date.now()) {
          actual = await actGithubReadonlyToken();
        }

        return actual.token;
      },
    });
  }, [token]);

  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}

export interface ApolloProviderProps {
  readonly children: ReactNode;
  readonly token: InstallationAccessTokenAuthentication;
}
