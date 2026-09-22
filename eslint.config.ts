// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import 'dotenv/config';

import graphql from '@graphql-eslint/eslint-plugin';
import vitest from '@vitest/eslint-plugin';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import storybook from 'eslint-plugin-storybook';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
    '.next/**',
    '.yarn/**',
    'build/**',
    'coverage/**',
    'lib/prisma/**',
    'lib/types/graphql.d.ts',
    'next-env.d.ts',
    'out/**',
  ]),
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
          patterns: [{ regex: '^@mui/(material|icons)+$' }],
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
      // @ts-expect-error To be fixed by https://github.com/graphql-hive/graphql-eslint/issues/2936
      '@graphql-eslint': graphql,
    },
    rules: graphql.configs['flat/operations-recommended'].rules,
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/prefer-called-exactly-once-with': 'off',
    },
  },
  // @ts-expect-error Reported in https://github.com/storybookjs/storybook/issues/32405
  ...storybook.configs['flat/recommended'],
]);
