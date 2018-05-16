<<<<<<< HEAD
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
    'camelcase': 0,
    'ember-suave/no-direct-property-access': 0,
    'ember-suave/require-access-in-comments': 0,
    'no-console': 0
  }
};
=======
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
    'addOfflineUsersForElectron': true,
    'attachCustomForm': true,
    'authenticateUser': true,
    'checkCustomFormIsDisplayed': true,
    'checkCustomFormIsFilled': true,
    'checkCustomFormIsFilledAndReadonly': true,
    'createCustomFormForType': true,
    'fillCustomForm': true,
    'invalidateSession': true,
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
    'camelcase': 0,
    'ember-suave/no-direct-property-access': 0,
    'ember-suave/require-access-in-comments': 0,
    'no-console': 0
  }
};
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
