'use server';

import { githubReadonlyToken } from '@/lib/github/github.auth';
import type { InstallationAccessTokenAuthentication } from '@octokit/auth-app';

export async function actGithubReadonlyToken(): Promise<InstallationAccessTokenAuthentication> {
  return githubReadonlyToken();
}
