<<<<<<< HEAD
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
=======
import EmberObject from '@ember/object';
import CanEditRequested from 'hospitalrun/mixins/can-edit-requested';
import { moduleFor, test } from 'ember-qunit';

moduleFor('mixin:can-edit-requested', 'Unit | Mixin | can-edit-requested');

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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
