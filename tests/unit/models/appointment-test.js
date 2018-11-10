import { module } from 'qunit';
import { setupTest } from 'ember-qunit';

import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

module('Unit | Model | appointment', function(hooks) {
  setupTest(hooks);

  testValidPropertyValues('appointmentType', ['test']);
  testInvalidPropertyValues('appointmentType', [undefined]);

  testValidPropertyValues('startDate', ['test']);
  testInvalidPropertyValues('startDate', [undefined]);
});
