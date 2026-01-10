import { webhooks } from '@/lib/github/octokit.webhooks';
import { type EmitterWebhookEvent } from '@octokit/webhooks';
import { flush, startSpan } from '@sentry/nextjs';
import { after } from 'next/server';

export async function POST(req: Request) {
  after(() => flush());

  const eventId = req.headers.get('X-GitHub-Delivery');
  const eventName = req.headers.get('X-GitHub-Event');
  const signature = req.headers.get('X-Hub-Signature-256');

  const payload = await req.text();

  // Check headers
  if (!eventId) return new Response('Missing event id', { status: 400 });
  if (!eventName) return new Response('Missing event name', { status: 400 });
  if (!signature) return new Response('Missing signature', { status: 400 });

  // Check signature
  const isValid = await webhooks.verify(payload, signature);

  if (!isValid) {
    return new Response('Invalid signature', { status: 401 });
  }

  // Handle event
  await startSpan(
    {
      op: 'github.event',
      name: eventName,
      attributes: { 'event.id': eventId, 'event.name': eventName, 'event.payload': payload },
    },
    async () => {
      await webhooks.receive({
        id: eventId,
        name: eventName,
        payload: JSON.parse(payload),
      } as EmitterWebhookEvent);
    },
  );

  return new Response();
}
