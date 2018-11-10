import { getOwner } from '@ember/application';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';

import { run } from '@ember/runloop';

module('Unit | Model | patient', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);

    this.owner.inject('model', 'i18n', 'service:i18n');

    // register t helper
    this.owner.register('helper:t', tHelper);
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
