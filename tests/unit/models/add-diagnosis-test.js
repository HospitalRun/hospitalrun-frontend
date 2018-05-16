<<<<<<< HEAD
import { moduleForModel } from 'ember-qunit';
import { testValidPropertyValues, testInvalidPropertyValues } from '../../helpers/validate-properties';

moduleForModel('add-diagnosis', 'Unit | Model | add-diagnosis', {
  // Specify the other units that are required for this test.
  needs: [
    'ember-validations@validator:local/presence'
  ]
});

testValidPropertyValues('diagnosis', ['test']);
testInvalidPropertyValues('diagnosis', [undefined]);
=======
import { moduleForModel } from 'ember-qunit';
import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

moduleForModel('add-diagnosis', 'Unit | Model | add-diagnosis', {
  // Specify the other units that are required for this test.
  needs: [
    'ember-validations@validator:local/presence'
  ]
});

testValidPropertyValues('diagnosis', ['test']);
testInvalidPropertyValues('diagnosis', [undefined]);
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
