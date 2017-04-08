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
    'Pikaday': true,
    'PouchDB': true,
    'Promise': true,
    'toolbox': true,
    'Uint8Array': true
  },

  rules: {
    'camelcase': 0,
    "brace-style": [ "warn", "1tbs", { "allowSingleLine": true } ],
    'ember-suave/no-direct-property-access': 0,
    'ember-suave/require-access-in-comments': 0,
    'max-statements-per-line': ["error", { "max": 3 }],
    'no-console': 0,
    'no-var': "warn",
    'no-undef': "warn"
  }
};
