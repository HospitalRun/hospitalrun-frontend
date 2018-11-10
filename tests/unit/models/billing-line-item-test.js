import { module } from 'qunit';
import { setupTest } from 'ember-qunit';

import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

module('Unit | Model | billing-line-item', function(hooks) {
  setupTest(hooks);

  testValidPropertyValues('category', ['test']);
  testInvalidPropertyValues('category', [undefined]);

  testValidPropertyValues('discount', [123, '123', 0.123, undefined]);
  testInvalidPropertyValues('discount', ['test']);

  testValidPropertyValues('nationalInsurance', [123, '123', 0.123, undefined]);
  testInvalidPropertyValues('nationalInsurance', ['test']);

  testValidPropertyValues('name', ['test']);
  testInvalidPropertyValues('name', [undefined]);

  testValidPropertyValues('privateInsurance', [123, '123', 0.123, undefined]);
  testInvalidPropertyValues('privateInsurance', ['test']);
});
