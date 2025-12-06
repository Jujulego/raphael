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
  typography: {
    fontFamily: 'var(--font-roboto)',
  },
});
