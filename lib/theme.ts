'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  cssVariables: true,
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: '#635bff',
          light: '#827bff',
          dark: '#453fb2',
        },
        secondary: {
          main: '#ff9100',
          light: '#ffb74d',
          dark: '#f57c00',
        },
      },
    },
  },
  components: {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
        },
      },
    },
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
  zIndex: {
    appBar: 1200,
    drawer: 1100,
  },
});
