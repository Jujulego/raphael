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
      include: ['app/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
      reporter: ['lcovonly'],
    },
    outputFile: {
      junit: 'junit-report.xml',
    },
  },
});
