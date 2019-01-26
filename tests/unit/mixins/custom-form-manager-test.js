import EmberObject from '@ember/object';
import CustomFormManagerMixin from 'hospitalrun/mixins/custom-form-manager';
import { module, test } from 'qunit';

module('Unit | Mixin | custom form manager', function() {
  // Replace this with your real tests.
  test('it works', function(assert) {
    let CustomFormManagerObject = EmberObject.extend(CustomFormManagerMixin);
    let subject = CustomFormManagerObject.create();
    assert.ok(subject);
  });
});
