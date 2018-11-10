import { getOwner } from '@ember/application';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';

import { run } from '@ember/runloop';

module('Unit | Model | patient-note', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);

    // manually inject the i18n service as initialzer does not run
    // in unit test
    this.owner.inject('model', 'i18n', 'service:i18n');

    // register t helper
    this.owner.register('helper:t', tHelper);
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
