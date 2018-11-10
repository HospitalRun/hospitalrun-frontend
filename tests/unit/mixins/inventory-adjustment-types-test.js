import EmberObject from '@ember/object';
import { getOwner } from '@ember/application';
import AdjustmentTypes from 'hospitalrun/mixins/inventory-adjustment-types';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import tHelper from 'ember-i18n/helper';
import localeConfig from 'ember-i18n/config/en';

module('Unit | Mixin | inventory-adjustment-types', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.subject = function() {
      let AdjustmentTypesObject = EmberObject.extend(AdjustmentTypes);
      this.owner.register('inventory-adjustment-types:main', AdjustmentTypesObject);
      return this.owner.lookup('inventory-adjustment-types:main');

    };
  });

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:i18n').set('locale', 'en');
    this.owner.register('locale:en/config', localeConfig);

    // Inject i18n as the intializer does not run in unit test
    this.owner.inject('inventory-adjustment-types', 'i18n', 'service:i18n');

    // register t helper
    this.owner.register('helper:t', tHelper);
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
});
