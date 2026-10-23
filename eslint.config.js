import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const FSD_LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

const layerRestrictions = (layer) => {
  const lower = FSD_LAYERS.slice(FSD_LAYERS.indexOf(layer) + 1)
  const forbidden = FSD_LAYERS.filter((candidate) => candidate !== layer && !lower.includes(candidate))
  return [
    {
      group: ['@/*/*/*', '@/*/*/*/**'],
      message: "FSD: importe pela API pública (index.ts) do slice/segmento, ex.: '@/entities/nft'.",
    },
    ...(forbidden.length
      ? [
          {
            group: forbidden.map((name) => `@/${name}`).flatMap((path) => [path, `${path}/**`]),
            message: `FSD: a camada '${layer}' só pode importar de camadas inferiores (${lower.join(', ') || 'nenhuma'}).`,
          },
        ]
      : []),
  ]
}

export default defineConfig([
  globalIgnores([
    'dist',
    'coverage',
    'playwright-report',
    'test-results',
    'lighthouse-reports',
    'public/mockServiceWorker.js',
    'src/app/router/routeTree.gen.ts',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'smart'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'object-shorthand': 'error',
      'prefer-const': 'error',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    rules: {
      'react-refresh/only-export-components': ['error', { allowConstantExport: true, allowExportNames: ['Route'] }],
    },
  },
  ...FSD_LAYERS.map((layer) => ({
    files: [`src/${layer}/**/*.{ts,tsx}`],
    rules: { 'no-restricted-imports': ['error', { patterns: layerRestrictions(layer) }] },
  })),
  {
    files: ['src/shared/ui/**/*.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    files: ['src/shared/mocks/**/*.ts'],
    rules: { 'no-console': 'off' },
  },
  {
    files: ['*.{js,ts}', 'scripts/**/*.ts', 'tests/**/*.ts'],
    languageOptions: { globals: globals.node },
    rules: { 'no-console': 'off' },
  },
  prettier,
])
