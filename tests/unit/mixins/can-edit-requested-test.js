import EmberObject from '@ember/object';
import CanEditRequested from 'hospitalrun/mixins/can-edit-requested';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Mixin | can-edit-requested', function(hooks) {
  setupTest(hooks);

  test('canEdit', function(assert) {
    let canEditRequested = EmberObject.extend(CanEditRequested).create({
      status: 'Requested'
    });

    assert.strictEqual(canEditRequested.get('canEdit'), true);
  });

  test('canEdit false', function(assert) {
    let canEditRequested = EmberObject.extend(CanEditRequested).create();

    assert.strictEqual(canEditRequested.get('canEdit'), false);
  });
});
