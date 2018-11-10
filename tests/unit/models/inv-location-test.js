import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';

import { run } from '@ember/runloop';

module('Unit | Model | inv-location', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);

    // register t helper
    this.owner.register('helper:t', tHelper);
  });

  test('locationNameWithQuantity', function(assert) {
    let invLocation = run(() => this.owner.lookup('service:store').createRecord('inv-location', {
      quantity: 3,
      locationName: 'Test Location'
    }));

    assert.equal(invLocation.get('locationNameWithQuantity'), 'Test Location (3 available)');
  });
});
