module.exports = {
  parserOptions: {
    'ecmaVersion': 2017,
  },

  env: {
    'embertest': true
  },

  extends: [
    'eslint:recommended',
    'plugin:ember-suave/recommended'
  ],

  globals: {
    '$': true,
    'authenticateUser': true,
    'invalidateSession': true,
    'require': true,
    'selectDate': true,
    'typeAheadFillIn': true,
    'wait': true,
    'waitToAppear': true,
    'waitToDisappear': true
  },

  rules: {
    'camelcase': 0,
    'ember-suave/no-direct-property-access': 0,
    'ember-suave/require-access-in-comments': 0,
    'no-console': 0
  }
};
