'use server';

import { githubAppToken } from '@/lib/github.auth';

export async function actGithubAppToken() {
  return githubAppToken();
}
