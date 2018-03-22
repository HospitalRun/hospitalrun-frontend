import Ember from 'ember';
import CustomFormManagerMixin from 'hospitalrun/mixins/custom-form-manager';
import { module, test } from 'qunit';

module('Unit | Mixin | custom form manager');

// Replace this with your real tests.
test('it works', function(assert) {
  let CustomFormManagerObject = Ember.Object.extend(CustomFormManagerMixin);
  let subject = CustomFormManagerObject.create();
  assert.ok(subject);
});
