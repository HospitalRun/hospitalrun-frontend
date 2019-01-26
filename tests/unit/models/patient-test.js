import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Model | patient', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:intl').set('locale', 'en');
    this.owner.inject('model', 'intl', 'service:intl');
  });

  test('displayAddress', function(assert) {
    let patient = run(() => this.owner.lookup('service:store').createRecord('patient', {
      address: '123 Main St.',
      address2: 'Apt #2',
      address4: 'Test'
    }));

    assert.strictEqual(patient.get('displayAddress'), '123 Main St., Apt #2, Test');
  });
});
