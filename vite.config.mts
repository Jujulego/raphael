import { defineConfig } from 'vitest/config';

export default defineConfig({
  cacheDir: '.vite',
  plugins: [],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: 'jsdom',
    reporters: ['default', 'junit'],
    exclude: [
      '**/.git/**',
      '**/.idea/**',
      '**/.next/**',
      '**/.yarn/**',
      '**/dist/**',
      '**/node_modules/**',
    ],
    coverage: {
      reporter: ['lcovonly'],
    },
    outputFile: {
      junit: 'junit-report.xml',
    },
  },
});
