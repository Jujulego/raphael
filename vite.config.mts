import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  cacheDir: '.vite',
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    reporters: ['default', 'junit'],
    outputFile: {
      junit: 'junit-report.xml',
    },
    coverage: {
      include: ['app/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
      exclude: ['lib/prisma/**', 'lib/types/graphql.d.ts'],
      reporter: ['lcovonly'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          exclude: [
            '**/.agents/**',
            '**/.git/**',
            '**/.github/**',
            '**/.husky/**',
            '**/.idea/**',
            '**/.next/**',
            '**/.yarn/**',
            '**/dist/**',
            '**/node_modules/**',
          ],
          setupFiles: './tests/setup.ts',
          pool: 'vmThreads',
        },
      },
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({
            configDir: path.join(import.meta.dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
});
