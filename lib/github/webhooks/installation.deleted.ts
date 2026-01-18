import prisma from '@/lib/prisma.client';
import type { EmitterWebhookEvent } from '@octokit/webhooks';

export async function installationDeletedHook({
  payload,
}: EmitterWebhookEvent<'installation.deleted'>) {
  await prisma.installation.delete({
    where: {
      id: payload.installation.id,
    },
  });
}
