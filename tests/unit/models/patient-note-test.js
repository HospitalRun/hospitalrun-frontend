import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

import { run } from '@ember/runloop';

module('Unit | Model | patient-note', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:intl').set('locale', 'en');

    // manually inject the intl service as initialzer does not run
    // in unit test
    this.owner.inject('model', 'intl', 'service:intl');
  });

  test('authoredBy', function(assert) {
    let patientNote = run(() => this.owner.lookup('service:store').createRecord('patient-note', {
      createdBy: 'Test Person'
    }));

    assert.strictEqual(patientNote.get('authoredBy'), 'Test Person');
  });

  test('authoredBy', function(assert) {
    let patientNote = run(() => this.owner.lookup('service:store').createRecord('patient-note', {
      createdBy: 'Test Person',
      attribution: 'Test Organization'
    }));

    assert.strictEqual(patientNote.get('authoredBy'), 'Test Person on behalf of Test Organization');
  });
});
