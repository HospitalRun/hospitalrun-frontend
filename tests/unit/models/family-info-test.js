import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import { getContext } from "@ember/test-helpers";
import { run } from "@ember/runloop";
import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

module('Unit | Model | family-info', function(hooks) {
  setupTest(hooks);
  hooks.beforeEach(function () {
    let { owner } = getContext();

    this.subject = () => run(() => owner
      .lookup("service:store")
      .createRecord("family-info"));
  });

  testValidPropertyValues('age', [123, 123.0, '123', undefined]);
  testInvalidPropertyValues('age', ['test']);

  testValidPropertyValues('name', ['Test Person']);
  testInvalidPropertyValues('name', [undefined]);
});
