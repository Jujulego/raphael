import { defineConfig } from 'vitest/config';

export default defineConfig({
  cacheDir: '.vite',
  plugins: [],
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
    pool: 'vmThreads',
    reporters: ['default', 'junit'],
    coverage: {
      reporter: ['cobertura', 'lcovonly'],
    },
    outputFile: {
      junit: 'junit-report.xml',
    },
  },
});
