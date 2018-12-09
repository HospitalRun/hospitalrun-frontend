import EmberObject from '@ember/object';
import AdjustmentTypes from 'hospitalrun/mixins/inventory-adjustment-types';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Mixin | inventory-adjustment-types', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // set the locale and the config
    this.owner.lookup('service:intl').set('locale', 'en');
  });

  hooks.beforeEach(function() {
    this.subject = function() {
      let AdjustmentTypesObject = EmberObject.extend(AdjustmentTypes);
      this.owner.register('inventory-adjustment-types:main', AdjustmentTypesObject);
      return this.owner.lookup('inventory-adjustment-types:main');
    };
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
