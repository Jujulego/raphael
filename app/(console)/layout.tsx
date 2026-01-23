import type { Metadata } from 'next';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';

export default function ConsoleLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <AppBar position="fixed" elevation={2}>
        <Toolbar>
          <Link href="/" className="typography-h6">
            Raphael
          </Link>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </>
  );
}

export const metadata: Metadata = {
  title: 'Raphael',
};
