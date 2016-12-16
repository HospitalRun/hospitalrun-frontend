import CanEditRequested from 'hospitalrun/mixins/can-edit-requested';
import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('mixin:can-edit-requested', 'Unit | Mixin | can-edit-requested');

test('canEdit', function(assert) {
  let canEditRequested = Ember.Object.extend(CanEditRequested).create({
    status: 'Requested'
  });

  assert.strictEqual(canEditRequested.get('canEdit'), true);
});

test('canEdit false', function(assert) {
  let canEditRequested = Ember.Object.extend(CanEditRequested).create();

  assert.strictEqual(canEditRequested.get('canEdit'), false);
});
