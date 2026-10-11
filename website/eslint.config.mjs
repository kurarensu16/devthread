import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import hooks from 'eslint-plugin-react-hooks';

export default defineConfig([
  js.configs.recommended,
  ...ts.configs.recommended,
  { files: ['**/*.mjs'], languageOptions: { globals: { console: 'readonly', process: 'readonly', URL: 'readonly' } } },
  {
    files: ['**/*.tsx'],
    plugins: { 'jsx-a11y': jsxA11y, 'react-hooks': hooks },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      ...hooks.configs.recommended.rules,
      // Scrollable code regions need keyboard focus at narrow widths.
      'jsx-a11y/no-noninteractive-tabindex': ['error', { roles: ['tabpanel', 'region'] }],
    },
    settings: { 'jsx-a11y': { components: { Link: 'a' } } },
  },
  globalIgnores(['.next/**', '.source/**', 'out/**', 'next-env.d.ts']),
]);
