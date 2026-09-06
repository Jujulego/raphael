import { auth } from '@/lib/auth/server';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - api/auth (auth routes)
     * - api/cron (cron jobs)
     * - api/github (GitHub webhooks)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|api/auth|api/cron|api/github|auth|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

export async function proxy(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const data = await auth.api.signInSocial({
      headers: await headers(),
      body: {
        provider: 'github',
      },
    });

    if (data.redirect && data.url) {
      return NextResponse.redirect(data.url);
    } else {
      return NextResponse.redirect(new URL('404', req.url));
    }
  }

  return NextResponse.next();
}
