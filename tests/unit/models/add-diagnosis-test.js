import { module } from 'qunit';
import { setupTest } from 'ember-qunit';
import { getContext } from "@ember/test-helpers";
import { run } from "@ember/runloop";
import {
  testValidPropertyValues,
  testInvalidPropertyValues
} from '../../helpers/validate-properties';

module('Unit | Model | add-diagnosis', function(hooks) {
  setupTest(hooks);
  hooks.beforeEach(function () {
    let { owner } = getContext();

    this.subject = () => run(() => owner
      .lookup("service:store")
      .createRecord("add-diagnosis"));
  });

  testValidPropertyValues('diagnosis', ['test']);
  testInvalidPropertyValues('diagnosis', [undefined]);
});
