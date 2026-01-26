import { issuesHook } from '@/lib/github/webhooks/issues';
import { Webhooks } from '@octokit/webhooks';
import { installationRepositoriesHook } from './webhooks/installation-repositories';
import { installationCreatedHook } from './webhooks/installation.created';
import { installationDeletedHook } from './webhooks/installation.deleted';
import { pullRequestClosedHook } from './webhooks/pull-request.closed';
import { pullRequestOpenedHook } from './webhooks/pull-request.opened';

import 'server-only';

export const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET!,
});

webhooks.on('installation.created', installationCreatedHook);
webhooks.on('installation.deleted', installationDeletedHook);
webhooks.on('installation_repositories', installationRepositoriesHook);
webhooks.on('issues', issuesHook);
webhooks.on('pull_request.closed', pullRequestClosedHook);
webhooks.on('pull_request.opened', pullRequestOpenedHook);
webhooks.on('pull_request.reopened', pullRequestOpenedHook);
