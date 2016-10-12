module.exports = {
  env: {
    'embertest': true
  },

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
    'no-console': 0
  }
};
