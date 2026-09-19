import { auth } from '@/lib/auth/server';
import { headers } from 'next/headers';
import { unauthorized } from 'next/navigation';

export async function currentSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    unauthorized();
  }

  return session;
}
