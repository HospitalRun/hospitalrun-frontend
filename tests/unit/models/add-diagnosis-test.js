import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

module('Unit | Model | add-diagnosis', function(hooks) {
  setupTest(hooks);

  testValidPropertyValues('diagnosis', ['test']);
  testInvalidPropertyValues('diagnosis', [undefined]);
});
