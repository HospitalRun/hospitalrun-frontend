<<<<<<< HEAD
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

testValidPropertyValues('startDate', ['test']);
testInvalidPropertyValues('startDate', [undefined]);
=======
import { moduleForModel } from 'ember-qunit';

import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

moduleForModel('appointment', 'Unit | Model | appointment', {
  needs: [
    'ember-validations@validator:local/acceptance',
    'ember-validations@validator:local/presence',
    'model:patient',
    'model:visit',
    'service:session'
  ]
});

testValidPropertyValues('appointmentType', ['test']);
testInvalidPropertyValues('appointmentType', [undefined]);

testValidPropertyValues('startDate', ['test']);
testInvalidPropertyValues('startDate', [undefined]);
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
