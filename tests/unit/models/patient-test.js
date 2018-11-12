import { getOwner } from '@ember/application';
import { moduleForModel, test } from 'ember-qunit';
import tHelper from 'ember-intl/helpers/t';

moduleForModel('patient', 'Unit | Model | patient', {
  needs: [
    'config:environment',
    'ember-validations@validator:local/format',
    'ember-validations@validator:local/presence',
    'model:allergy',
    'model:diagnosis',
    'model:operation-report',
    'model:operative-plan',
    'model:payment',
    'model:price-profile',
    'service:session',
    'service:intl',
    'ember-intl@adapter:default',
    'cldr:cn',
    'cldr:de',
    'cldr:en',
    'cldr:es',
    'cldr:gr',
    'cldr:hi',
    'cldr:pt',
    'cldr:th',
    'cldr:tw',
    'cldr:de',
    'cldr:es',
    'cldr:fr',
    'cldr:he',
    'cldr:it',
    'cldr:ru',
    'cldr:tr',
    'cldr:ur',
    'translation:en',
    'util:intl/missing-message'
  ],
  beforeEach() {
    // set the locale and the config
    this.container.lookup('service:intl').set('locale', 'en');
    getOwner(this).inject('model', 'intl', 'service:intl');

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
