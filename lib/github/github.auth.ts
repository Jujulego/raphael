import { createAppAuth, type InstallationAccessTokenAuthentication } from '@octokit/auth-app';
import 'server-only';

const appAuth = createAppAuth({
  appId: process.env.GITHUB_APP_ID!,
  installationId: process.env.GITHUB_INSTALLATION_ID,
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
});

export async function githubReadonlyToken(): Promise<InstallationAccessTokenAuthentication> {
  return await appAuth({
    type: 'installation',
    permissions: {
      issues: 'read',
      metadata: 'read',
      pull_requests: 'read',
    },
  });
}
