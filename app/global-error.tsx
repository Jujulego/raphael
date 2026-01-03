'use client';

import { roboto } from '@/lib/fonts';
import MuiProvider from '@/lib/MuiProvider';
import * as Sentry from '@sentry/nextjs';
import NextError from 'next/error';
import { useEffect } from 'react';

import './theme.css';

export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html className={roboto.variable} lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <MuiProvider>
          <NextError statusCode={0} />
        </MuiProvider>
      </body>
    </html>
  );
}

export interface GlobalErrorProps {
  readonly error: Error & { readonly digest?: string };
}
