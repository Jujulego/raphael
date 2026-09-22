import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  cacheDir: '.vite',
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    exclude: [
      '**/.git/**',
      '**/.idea/**',
      '**/.next/**',
      '**/.yarn/**',
      '**/dist/**',
      '**/node_modules/**',
    ],
    globals: true,
    pool: 'vmThreads',
    reporters: ['default', 'junit'],
    setupFiles: './tests/setup.ts',
    coverage: {
      include: ['app/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
      exclude: ['lib/prisma/**', 'lib/types/graphql.d.ts'],
      reporter: ['lcovonly'],
    },
    outputFile: {
      junit: 'junit-report.xml',
    },
  },
});
