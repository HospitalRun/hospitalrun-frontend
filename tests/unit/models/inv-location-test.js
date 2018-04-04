import { moduleForModel, test } from 'ember-qunit';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';

moduleForModel('inv-location', 'Unit | Model | inv-location', {
  needs: [
    'ember-validations@validator:local/numericality',
    'ember-validations@validator:local/acceptance',
    'ember-validations@validator:local/presence',
    'service:i18n',
    'service:session',
    'locale:en/translations',
    'locale:en/config',
    'util:i18n/missing-message',
    'util:i18n/compile-template',
    'config:environment'
  ],
  beforeEach() {
    // set the locale and the config
    this.container.lookup('service:i18n').set('locale', 'en');
    this.registry.register('locale:en/config', localeConfig);

    // register t helper
    this.registry.register('helper:t', tHelper);
  }
});

test('locationNameWithQuantity', function(assert) {
  let invLocation = this.subject({
    quantity: 3,
    locationName: 'Test Location'
  });

  assert.equal(invLocation.get('locationNameWithQuantity'), 'Test Location (3 available)');
});
