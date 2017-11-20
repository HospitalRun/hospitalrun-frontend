import { moduleForModel } from 'ember-qunit';

import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

moduleForModel('family-info', 'Unit | Model | family-info', {
  needs: [
    'ember-validations@validator:local/presence',
    'ember-validations@validator:local/numericality'
  ]
});

testValidPropertyValues('age', [123, 123.0, '123', undefined]);
testInvalidPropertyValues('age', ['test']);

testValidPropertyValues('name', ['Test Person']);
testInvalidPropertyValues('name', [undefined]);
