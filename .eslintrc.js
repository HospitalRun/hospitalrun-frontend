module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },

  extends: 'eslint:recommended',

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
    'no-console': 0
  }
};
