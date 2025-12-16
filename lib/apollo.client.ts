import { githubAppToken } from '@/lib/github.auth';
import { registerApolloClient } from '@apollo/client-integration-nextjs';
import { prepareClient } from './apollo.config';

export const { getClient, query, PreloadQuery } = registerApolloClient(() =>
  prepareClient({
    async token() {
      const { token } = await githubAppToken();
      return token;
    },
  }),
);
