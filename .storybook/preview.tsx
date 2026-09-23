import { roboto } from '@/lib/fonts';
import MuiProvider from '@/lib/MuiProvider';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import type { Preview } from '@storybook/nextjs-vite';
import { clsx } from 'clsx';

import '../app/theme.css';

const preview: Preview = {
  parameters: {
    a11y: {
      test: 'error',
    },
    backgrounds: {
      disable: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story, { viewMode }) => (
      <MuiProvider>
        <ScopedCssBaseline
          className={clsx(roboto.variable, { 'min-h-screen': viewMode !== 'docs' })}
        >
          <Story />
        </ScopedCssBaseline>
      </MuiProvider>
    ),
  ],
};

export default preview;
