import { theme } from '@/lib/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { ThemeProvider } from '@mui/material/styles';
import type { ReactNode } from 'react';

export default function MuiProvider({ children }: MuiProviderProps) {
  return (
    <>
      <InitColorSchemeScript />

      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </>
  );
}

export interface MuiProviderProps {
  readonly children: ReactNode;
}
