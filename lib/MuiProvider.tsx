import { theme } from '@/lib/theme';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import type { ReactNode } from 'react';

export default function MuiProvider({ children }: MuiProviderProps) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
}

export interface MuiProviderProps {
  readonly children: ReactNode;
}
