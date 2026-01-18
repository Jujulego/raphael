import { issuesClosedHook } from '@/lib/github/webhooks/issues.closed';
import { issuesOpenedHook } from '@/lib/github/webhooks/issues.opened';
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
webhooks.on('issues.closed', issuesClosedHook);
webhooks.on('issues.deleted', issuesClosedHook);
webhooks.on('issues.opened', issuesOpenedHook);
webhooks.on('issues.reopened', issuesOpenedHook);
webhooks.on('pull_request.closed', pullRequestClosedHook);
webhooks.on('pull_request.opened', pullRequestOpenedHook);
webhooks.on('pull_request.reopened', pullRequestOpenedHook);
