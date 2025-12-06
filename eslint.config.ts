import graphql from '@graphql-eslint/eslint-plugin';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['.next/**', 'build/**', 'out/**', 'next-env.d.ts', 'types/graphql.d.ts']),
  nextVitals,
  nextTs,
  prettier,
  {
    files: ['**/*.{ts,tsx}'],
    processor: graphql.processor,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [{ regex: '^@mui/[^/]+$' }],
        },
      ],
    },
  },
  {
    files: ['**/*.graphql'],
    languageOptions: {
      parser: graphql.parser,
    },
    plugins: {
      '@graphql-eslint': graphql,
    },
    rules: graphql.configs['flat/operations-recommended'].rules,
  },
]);
