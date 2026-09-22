import { roboto } from '@/lib/fonts';
import MuiProvider from '@/lib/MuiProvider';
import CssBaseline from '@mui/material/CssBaseline';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './theme.css';

export const metadata: Metadata = {
  title: 'Raphael',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html className={roboto.variable} lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <InitColorSchemeScript />
        <Analytics />

        <MuiProvider>
          <CssBaseline />
          {children}
        </MuiProvider>
      </body>
    </html>
  );
}

export interface RootLayoutProps {
  readonly children: ReactNode;
}
