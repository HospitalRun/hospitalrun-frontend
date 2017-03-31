import AdjustmentTypes from 'hospitalrun/mixins/inventory-adjustment-types';
import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';

moduleFor('mixin:inventory-adjustment-types', 'Unit | Mixin | inventory-adjustment-types', {
  needs: [
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

    // Inject i18n as the intializer does not run in unit test
    Ember.getOwner(this).inject('inventory-adjustment-types', 'i18n', 'service:i18n');

    // register t helper
    this.registry.register('helper:t', tHelper);
  },
  subject() {
    let AdjustmentTypesObject = Ember.Object.extend(AdjustmentTypes);
    this.registry.register('inventory-adjustment-types:main', AdjustmentTypesObject);
    return Ember.getOwner(this).lookup('inventory-adjustment-types:main');

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
