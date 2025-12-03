import js from '@eslint/js';
import parser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import configPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,mjs,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
    plugins: {
      react: reactPlugin,
    },
  },

  {
    name: 'app/eslint-ts-options',
    files: ['**/*.{ts,tsx}'],
    ignores: ['*.config.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },

  {
    name: 'app/eslint-ts-configs-options',
    files: ['*.config.ts'],
    languageOptions: {
      parser,
    },
  },

  {
    name: 'app/import-rules',
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
          paths: ['src'],
        },
        alias: {
          map: [['@app', './src']],
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      },
      'import/extensions': ['.js', '.mjs', '.jsx', '.ts', '.tsx'],
      'import/core-modules': [],
      'import/ignore': ['node_modules', '\\.(css|svg|json)$'],
    },
    rules: {
      // ensure imports point to files/modules that can be resolved
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md
      'import/no-unresolved': ['error', { commonjs: true, caseSensitive: true }],

      // ensure named imports coupled with named exports
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/named.md#when-not-to-use-it
      'import/named': 'error',

      // ensure default import coupled with default export
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/default.md#when-not-to-use-it
      'import/default': 'off',

      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/namespace.md
      'import/namespace': 'off',

      // disallow invalid exports, e.g. multiple defaults
      // https://github.com/import-js/eslint-plugin-import/blob/gmaster/docs/rules/export.md
      'import/export': 'error',

      // do not allow a default import name to match a named export
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-named-as-default.md
      'import/no-named-as-default': 'error',

      // warn on accessing default export property names that are also named exports
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-named-as-default-member.md
      'import/no-named-as-default-member': 'error',

      // disallow use of jsdoc-marked-deprecated imports
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-deprecated.md
      'import/no-deprecated': 'off',

      // Forbid the use of extraneous packages
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
      // paths are treated both as absolute paths, and relative to process.cwd()
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            'test/**', // tape, common npm pattern
            'tests/**', // also common npm pattern
            'spec/**', // mocha, rspec-like pattern
            '**/__tests__/**', // jest pattern
            '**/__mocks__/**', // jest pattern
            'test.{js,jsx,ts,tsx}', // repos with a single test file
            'test-*.{js,jsx,ts,tsx}', // repos with multiple top-level test files
            '**/*{.,_}{test,spec}.{js,jsx,ts,tsx}', // tests where the extension or filename suffix denotes that it is a test
            'test_data/**', // test data files
            'e2e/**', // e2e tests
            '*.config.{js,ts}', // config files
            'configs/**', // config directories
            'src/mock/**', // mock files
            'vite.config.ts',
            'tailwind.config.js',
            'postcss.config.js',
            'playwright.config.ts',
            'eslint.config.js',
          ],
          optionalDependencies: false,
        },
      ],

      // Forbid mutable exports
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-mutable-exports.md
      'import/no-mutable-exports': 'error',

      // Module systems:

      // disallow require()
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-commonjs.md
      'import/no-commonjs': 'off',

      // disallow AMD require/define
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-amd.md
      'import/no-amd': 'error',

      // No Node.js builtin modules
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-nodejs-modules.md
      'import/no-nodejs-modules': 'off', // Allow Node.js modules in config and test files

      // Style guide:

      // disallow non-import statements appearing before import statements
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/first.md
      'import/first': 'error',

      // disallow non-import statements appearing before import statements
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/imports-first.md
      // deprecated: use `import/first`
      'import/imports-first': 'off',

      // disallow duplicate imports
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-duplicates.md
      'import/no-duplicates': 'error',

      // disallow namespace imports
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-namespace.md
      // ToDo: enable
      'import/no-namespace': 'off',

      // Ensure consistent use of file extension within the import path
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/extensions.md
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          mjs: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],

      // ensure absolute imports are above relative imports and that unassigned imports are ignored
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/order.md
      // TODO: enforce a stricter convention in module import order?
      'import/order': ['error', { groups: [['builtin', 'external', 'internal']] }],

      // Require a newline after the last import/require in a group
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/newline-after-import.md
      'import/newline-after-import': 'error',

      // Require modules with a single export to use a default export
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
      'import/prefer-default-export': 'off', // Allow both default and named exports

      // Restrict which files can be imported in a given folder
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-restricted-paths.md
      'import/no-restricted-paths': 'off',

      // Forbid modules to have too many dependencies
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/max-dependencies.md
      'import/max-dependencies': ['off', { max: 10 }],

      // Forbid import of modules using absolute paths
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-absolute-path.md
      'import/no-absolute-path': 'error',

      // Forbid require() calls with expressions
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-dynamic-require.md
      'import/no-dynamic-require': 'error',

      // prevent importing the submodules of other modules
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-internal-modules.md
      'import/no-internal-modules': [
        'off',
        {
          allow: [],
        },
      ],

      // Warn if a module could be mistakenly parsed as a script by a consumer
      // leveraging Unambiguous JavaScript Grammar
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/unambiguous.md
      // this should not be enabled until this proposal has at least been *presented* to TC39.
      // At the moment, it's not a thing.
      'import/unambiguous': 'off',

      // Forbid Webpack loader syntax in imports
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-webpack-loader-syntax.md
      'import/no-webpack-loader-syntax': 'error',

      // Prevent unassigned imports
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-unassigned-import.md
      // importing for side effects is perfectly acceptable, if you need side effects.
      'import/no-unassigned-import': 'off',

      // Prevent importing the default as if it were named
      // https://github.com/import-js/eslint-plugin-import/blob/master/docs/rules/no-named-default.md
      'import/no-named-default': 'error',

      // Reports if a module's default export is unnamed
      // https://github.com/import-js/eslint-plugin-import/blob/d9b712ac7fd1fddc391f7b234827925c160d956f/docs/rules/no-anonymous-default-export.md
      'import/no-anonymous-default-export': [
        'off',
        {
          allowArray: false,
          allowArrowFunction: false,
          allowAnonymousClass: false,
          allowAnonymousFunction: false,
          allowLiteral: false,
          allowObject: false,
        },
      ],

      // This rule enforces that all exports are declared at the bottom of the file.
      // https://github.com/import-js/eslint-plugin-import/blob/98acd6afd04dcb6920b81330114e146dc8532ea4/docs/rules/exports-last.md
      // TODO: enable?
      'import/exports-last': 'off',

      // Reports when named exports are not grouped together in a single export declaration
      // or when multiple assignments to CommonJS module.exports or exports object are present
      // in a single file.
      // https://github.com/import-js/eslint-plugin-import/blob/44a038c06487964394b1e15b64f3bd34e5d40cde/docs/rules/group-exports.md
      'import/group-exports': 'off',

      // forbid default exports. this is a terrible rule, do not use it.
      // https://github.com/import-js/eslint-plugin-import/blob/44a038c06487964394b1e15b64f3bd34e5d40cde/docs/rules/no-default-export.md
      'import/no-default-export': 'off',

      // Prohibit named exports. this is a terrible rule, do not use it.
      // https://github.com/import-js/eslint-plugin-import/blob/1ec80fa35fa1819e2d35a70e68fb6a149fb57c5e/docs/rules/no-named-export.md
      'import/no-named-export': 'off',

      // Forbid a module from importing itself
      // https://github.com/import-js/eslint-plugin-import/blob/44a038c06487964394b1e15b64f3bd34e5d40cde/docs/rules/no-self-import.md
      'import/no-self-import': 'error',

      // Forbid cyclical dependencies between modules
      // https://github.com/import-js/eslint-plugin-import/blob/d81f48a2506182738409805f5272eff4d77c9348/docs/rules/no-cycle.md
      'import/no-cycle': ['error', { maxDepth: '∞' }],

      // Ensures that there are no useless path segments
      // https://github.com/import-js/eslint-plugin-import/blob/ebafcbf59ec9f653b2ac2a0156ca3bcba0a7cf57/docs/rules/no-useless-path-segments.md
      'import/no-useless-path-segments': ['error', { commonjs: true }],

      // dynamic imports require a leading comment with a webpackChunkName
      // https://github.com/import-js/eslint-plugin-import/blob/ebafcbf59ec9f653b2ac2a0156ca3bcba0a7cf57/docs/rules/dynamic-import-chunkname.md
      'import/dynamic-import-chunkname': [
        'off',
        {
          importFunctions: [],
          webpackChunknameFormat: '[0-9a-zA-Z-_/.]+',
        },
      ],

      // Use this rule to prevent imports to folders in relative parent paths.
      // https://github.com/import-js/eslint-plugin-import/blob/c34f14f67f077acd5a61b3da9c0b0de298d20059/docs/rules/no-relative-parent-imports.md
      'import/no-relative-parent-imports': 'off',

      // Reports modules without any exports, or with unused exports
      // https://github.com/import-js/eslint-plugin-import/blob/f63dd261809de6883b13b6b5b960e6d7f42a7813/docs/rules/no-unused-modules.md
      // TODO: enable once it supports CJS
      'import/no-unused-modules': [
        'off',
        {
          ignoreExports: [],
          missingExports: true,
          unusedExports: true,
        },
      ],

      // Reports the use of import declarations with CommonJS exports in any module except for the main module.
      // https://github.com/import-js/eslint-plugin-import/blob/1012eb951767279ce3b540a4ec4f29236104bb5b/docs/rules/no-import-module-exports.md
      'import/no-import-module-exports': [
        'error',
        {
          exceptions: [],
        },
      ],

      // Use this rule to prevent importing packages through relative paths.
      // https://github.com/import-js/eslint-plugin-import/blob/1012eb951767279ce3b540a4ec4f29236104bb5b/docs/rules/no-relative-packages.md
      'import/no-relative-packages': 'error',

      // enforce a consistent style for type specifiers (inline or top-level)
      // https://github.com/import-js/eslint-plugin-import/blob/d5fc8b670dc8e6903dbb7b0894452f60c03089f5/docs/rules/consistent-type-specifier-style.md
      // TODO, semver-major: enable (just in case)
      'import/consistent-type-specifier-style': ['off', 'prefer-inline'],

      // Reports the use of empty named import blocks.
      // https://github.com/import-js/eslint-plugin-import/blob/d5fc8b670dc8e6903dbb7b0894452f60c03089f5/docs/rules/no-empty-named-blocks.md
      // TODO, semver-minor: enable
      'import/no-empty-named-blocks': 'off',
    },
  },

  configPrettier,

  {
    name: 'app/eslint-ts',
    files: ['**/*.{ts,tsx}'],
    rules: {
      'arrow-parens': 'off',
      'class-methods-use-this': 'off',

      // ToDo: enable once useEffect fixed without empty return in guard clauses
      'consistent-return': 'off',
      'func-names': 'off',
      'function-paren-newline': 'off',
      'implicit-arrow-linebreak': 'off',

      'max-len': [
        'error',
        {
          code: 120,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true,
        },
      ],

      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info'],
        },
      ],

      'no-continue': 'off',

      'no-eval': [
        'error',
        {
          allowIndirect: true,
        },
      ],

      'no-mixed-operators': 'off',
      'no-param-reassign': 'off',
      'no-plusplus': 'off',
      'no-return-assign': ['error', 'except-parens'],
      'no-underscore-dangle': 'off',

      'object-curly-newline': [
        'error',
        {
          multiline: true,
          consistent: true,
        },
      ],

      'operator-linebreak': 'off',
      'prefer-destructuring': 'off',
      'space-before-function-paren': ['off', 'never'],

      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': 'off',
      'react-refresh/only-export-components': [
        'error',
        {
          allowConstantExport: true,
        },
      ],
      'react/jsx-wrap-multilines': [
        'error',
        {
          declaration: 'parens-new-line',
          assignment: 'parens-new-line',
          return: 'parens-new-line',
          arrow: 'parens-new-line',
          condition: 'parens-new-line',
          logical: 'parens-new-line',
          prop: false,
        },
      ],

      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
    },
  },
]);
