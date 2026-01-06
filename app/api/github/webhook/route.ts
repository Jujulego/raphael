import { type EmitterWebhookEvent, Webhooks } from '@octokit/webhooks';
import { startSpan } from '@sentry/nextjs';
import { timingSafeEqual } from 'node:crypto';

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET!,
});

export async function POST(req: Request) {
  const eventId = req.headers.get('X-GitHub-Delivery');
  const eventName = req.headers.get('X-GitHub-Event');
  const signature = req.headers.get('X-Hub-Signature-256');

  const payload = await req.json();

  // Check headers
  if (!eventId) return new Response('Missing event id', { status: 400 });
  if (!eventName) return new Response('Missing event name', { status: 400 });
  if (!signature) return new Response('Missing signature', { status: 400 });

  // Check signature
  const expected = Buffer.from(await webhooks.sign(payload));
  const actual = Buffer.from(signature.split('=')[1]);

  if (!timingSafeEqual(expected, actual)) {
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
        payload: payload,
      } as EmitterWebhookEvent);
    },
  );

  return new Response();
}
