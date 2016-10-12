module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },

  extends: [
    'eslint:recommended',
    'plugin:ember-suave/recommended'
  ],

  env: {
    'browser': true
  },

  globals: {
    '$': true,
    'Bloodhound': true,
    'dymo': true,
    'Filer': true,
    'logDebug': true,
    'moment': true,
    'Pikaday': true,
    'PouchDB': true,
    'Promise': true,
    'toolbox': true,
    'Uint8Array': true,
    'uuid': true
  },

  rules: {
    'array-bracket-spacing': 0,
    'camelcase': 0,
    'comma-spacing': 0,
    'ember-suave/no-const-outside-module-scope': 0,
    'ember-suave/no-direct-property-access': 0,
    'ember-suave/prefer-destructuring': 0,
    'ember-suave/require-access-in-comments': 0,
    'indent': 0,
    'key-spacing': 0,
    'keyword-spacing': 0,
    'new-cap': 0,
    'no-console': 0,
    'object-curly-spacing': 0,
    'object-shorthand': 0,
    'one-var': 0,
    'operator-linebreak': 0,
    'prefer-spread': 0,
    'prefer-template': 0,
    'quotes': 0,
    'spaced-comment': 0,
    'space-infix-ops': 0
  }
};
