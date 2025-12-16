'use client';

import { ApolloNextAppProvider } from '@apollo/client-integration-nextjs';
import { type ReactNode, useCallback } from 'react';
import { prepareClient } from './apollo.config';

export function ApolloProvider({ children, token }: ApolloProviderProps) {
  const makeClient = useCallback(() => prepareClient({ token: () => token }), [token]);

  return <ApolloNextAppProvider makeClient={makeClient}>{children}</ApolloNextAppProvider>;
}

export interface ApolloProviderProps {
  readonly children: ReactNode;
  readonly token: string;
}
