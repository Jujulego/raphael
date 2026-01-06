import { type EmitterWebhookEvent, Webhooks } from '@octokit/webhooks';
import { startSpan } from '@sentry/nextjs';

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET!,
});

export async function GET(req: Request) {
  const requestId = req.headers.get('x-request-id');
  const eventName = req.headers.get('x-github-event');
  const signature = req.headers.get('x-hub-signature-256');

  const payload = await req.json();

  if (!requestId) return new Response('Missing request id', { status: 400 });
  if (!eventName) return new Response('Missing event name', { status: 400 });
  if (!signature) return new Response('Missing signature', { status: 400 });

  // Check signature
  const isValid = await webhooks.verify(payload, signature);

  if (!isValid) {
    console.log('Refusing webhook: invalid signature');
    return new Response('', { status: 401 });
  }

  await startSpan(
    {
      op: 'github.event',
      name: eventName,
      attributes: { 'event.id': requestId, 'event.name': eventName, 'event.payload': payload },
    },
    () =>
      webhooks.receive({
        id: requestId,
        name: eventName,
        payload,
      } as EmitterWebhookEvent),
  );

  return new Response();
}
