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
