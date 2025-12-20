import { githubReadonlyToken } from '@/lib/github.auth';
import { registerApolloClient } from '@apollo/client-integration-nextjs';
import { prepareClient } from './apollo.config';

export const { getClient, query, PreloadQuery } = registerApolloClient(() =>
  prepareClient({
    async token() {
      const { token } = await githubReadonlyToken();
      return token;
    },
  }),
);
