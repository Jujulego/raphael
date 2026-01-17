import 'server-only';
import { installationDeletedHook } from '@/lib/github/webhooks/installation-deleted';

import { Webhooks } from '@octokit/webhooks';
import { installationCreatedHook } from './webhooks/installation-created';

export const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET!,
});

webhooks.on('installation.created', installationCreatedHook);
webhooks.on('installation.deleted', installationDeletedHook);
