import EmberObject from '@ember/object';
import { getOwner } from '@ember/application';
import AdjustmentTypes from 'hospitalrun/mixins/inventory-adjustment-types';
import { moduleFor, test } from 'ember-qunit';
import tHelper from 'ember-intl/helpers/t';

moduleFor('mixin:inventory-adjustment-types', 'Unit | Mixin | inventory-adjustment-types', {
  needs: [
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
    'util:intl/missing-message',
    'config:environment'
  ],
  beforeEach() {
    // set the locale and the config
    this.container.lookup('service:intl').set('locale', 'en');

    // Inject intl as the intializer does not run in unit test
    getOwner(this).inject('inventory-adjustment-types', 'intl', 'service:intl');

    // register t helper
    this.registry.register('helper:t', tHelper);
  },
  subject() {
    let AdjustmentTypesObject = EmberObject.extend(AdjustmentTypes);
    this.registry.register('inventory-adjustment-types:main', AdjustmentTypesObject);
    return getOwner(this).lookup('inventory-adjustment-types:main');

  }
});

test('checkTranslations', function(assert) {
  let InventoryAdjustmentTypes = this.subject();
  assert.deepEqual(InventoryAdjustmentTypes.get('adjustmentTypes'), [
    {
      name: 'Add',
      type: 'Adjustment (Add)'
    },
    {
      name: 'Remove',
      type: 'Adjustment (Remove)'
    },
    {
      name: 'Return To Vendor',
      type: 'Return To Vendor'
    },
    {
      name: 'Return',
      type: 'Return'
    },
    {
      name: 'Write Off',
      type: 'Write Off'
    }
  ]);
});
