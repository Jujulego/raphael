import { createAppAuth } from '@octokit/auth-app';

const appAuth = createAppAuth({
  appId: process.env.GITHUB_APP_ID!,
  installationId: process.env.GITHUB_INSTALLATION_ID,
  clientId: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
});

export async function githubAppToken() {
  const { token } = await appAuth({ type: 'installation' });
  return token;
}
