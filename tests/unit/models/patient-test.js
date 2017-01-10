import { moduleForModel, test } from 'ember-qunit';
import Ember from 'ember';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';

moduleForModel('patient', 'Unit | Model | patient', {
  needs: [
    'ember-validations@validator:local/format',
    'ember-validations@validator:local/presence',
    'model:allergy',
    'model:diagnosis',
    'model:payment',
    'model:price-profile',
    'service:i18n',
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

    Ember.getOwner(this).inject('model', 'i18n', 'service:i18n');

    // register t helper
    this.registry.register('helper:t', tHelper);
  }
});

test('displayAddress', function(assert) {
  let patient = this.subject({
    address: '123 Main St.',
    address2: 'Apt #2',
    address4: 'Test'
  });

  assert.strictEqual(patient.get('displayAddress'), '123 Main St., Apt #2, Test');
});
