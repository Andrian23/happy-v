import { defineConfig } from "eslint/config";
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginNext from '@next/eslint-plugin-next';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@next/next': pluginNext
    },
  },
  {
    files: ["postcss.config.js"],
    rules: {
        "no-undef": "off",
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      ...pluginNext.configs.recommended.rules
    }
  },
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: {
      'simple-import-sort': simpleImportSort
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    }
  },
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // `react` first, `next` second, then packages starting with a character
            ['^react$', '^next', '^[a-z]'],
            // Packages starting with `@`
            ['^@'],
            // Packages starting with `@/`
            ['^@/'],
            // Imports starting with `../`
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Imports starting with `./`
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports
            ['^.+\\.s?css$'],
            // Side effect imports
            ['^\\u0000']
          ]
        }
      ]
    }
  }
]);