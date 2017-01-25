import { moduleForModel } from 'ember-qunit';

import { testValidPropertyValues, testInvalidPropertyValues } from '../../helpers/validate-properties';

moduleForModel('appointment', 'Unit | Model | appointment', {
  needs: [
    'ember-validations@validator:local/acceptance',
    'ember-validations@validator:local/presence',
    'model:patient',
    'model:visit'
  ]
});

testValidPropertyValues('appointmentType', ['test']);
testInvalidPropertyValues('appointmentType', [undefined]);

testValidPropertyValues('location', ['test']);
testInvalidPropertyValues('location', [undefined]);

testValidPropertyValues('startDate', ['test']);
testInvalidPropertyValues('startDate', [undefined]);
