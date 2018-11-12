import { moduleForModel, test } from 'ember-qunit';
import tHelper from 'ember-intl/helpers/t';

moduleForModel('inv-location', 'Unit | Model | inv-location', {
  needs: [
    'ember-validations@validator:local/numericality',
    'ember-validations@validator:local/acceptance',
    'ember-validations@validator:local/presence',
    'service:session',
    'config:environment',
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
