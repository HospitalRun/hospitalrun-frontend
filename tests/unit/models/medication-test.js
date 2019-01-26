import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Model | medication', function(hooks) {
  setupTest(hooks);

  test('isRequested', function(assert) {
    let medication = run(() => this.owner.lookup('service:store').createRecord('medication', { status: 'Requested' }));

    assert.strictEqual(medication.get('isRequested'), true);
  });

  test('isRequested false', function(assert) {
    let medication = run(() => this.owner.lookup('service:store').createRecord('medication', { status: 'Test' }));

    assert.strictEqual(medication.get('isRequested'), false);
  });
});
