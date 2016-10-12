module.exports = {
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
    'moment': true,
    'require': true,
    'runWithPouchDump': true,
    'select': true,
    'selectDate': true,
    'typeAheadFillIn': true,
    'wait': true,
    'waitToAppear': true,
    'waitToDisappear': true
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
