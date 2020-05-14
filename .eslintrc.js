module.exports = {
  ignorePatterns: ['commitlint.config.js', 'jest.config.js'],
  env: {
    browser: true,
    es6: true,
    'jest/globals': true,
  },
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'eslint-config-prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ["node_modules"],
      },
      "typescript": {
        alwaysTryTypes: true,
      }
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  plugins: ['react', '@typescript-eslint', 'prettier', 'jest', 'import'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    '@typescript-eslint/unified-signatures': 'error',
    '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true }],
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-wrap-multilines': 'off',
    'react/jsx-props-no-spreading': 'off',
    'arrow-body-style': ['warn', 'as-needed'],
    'no-param-reassign': ['error', { props: false }],
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'off',
    'no-console': 'off',
    'eol-last': ['error', 'always'],
    'no-debugger': 'error',
    'no-nested-ternary': 'off',
    'import/no-unresolved': 'error',
    'import/extensions': ['error', 'never'],
    'import/order': ["error", {
      "groups": [
        "external",
        ["sibling","parent","internal"],
        "builtin",
        "unknown",
      ],
      "newlines-between": "always",
      "alphabetize": {
        "order": 'asc',
        "caseInsensitive": true,
      },
    }],
    curly: ['error', 'all'],
  },
}
