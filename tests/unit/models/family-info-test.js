import { module } from 'qunit';
import { setupTest } from 'ember-qunit';

import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

module('Unit | Model | family-info', function(hooks) {
  setupTest(hooks);

  testValidPropertyValues('age', [123, 123.0, '123', undefined]);
  testInvalidPropertyValues('age', ['test']);

  testValidPropertyValues('name', ['Test Person']);
  testInvalidPropertyValues('name', [undefined]);
});
