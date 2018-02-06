import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
import LocationName from 'hospitalrun/mixins/location-name';
import NumberFormat from 'hospitalrun/mixins/number-format';

const { computed } = Ember;

function defaultQuantityGroups() {
  return [];
}

/**
 * Model to represent a purchase within an inventory item.
 * File/model name is inv-purchase because using inventory-purchase will cause purchase
 * items to be shown as inventory items since the pouchdb adapter does a
 * retrieve for keys starting with 'inventory' to fetch inventory items.
 */
let InventoryPurchaseItem = AbstractModel.extend(LocationName, NumberFormat, {
  purchaseCost: DS.attr('number'),
  lotNumber: DS.attr('string'),
  dateReceived: DS.attr('date'),
  originalQuantity: DS.attr('number'),
  currentQuantity: DS.attr('number'),
  expirationDate: DS.attr('date'),
  expired: DS.attr('boolean'),
  location: DS.attr('string'),
  aisleLocation: DS.attr('string'),
  giftInKind: DS.attr('boolean'),
  inventoryItem: DS.attr('string'), // Currently just storing id instead of DS.belongsTo('inventory', { async: true }),
  vendor: DS.attr('string'),
  vendorItemNo: DS.attr('string'),
  distributionUnit: DS.attr('string'),
  invoiceNo: DS.attr('string'),
  quantityGroups: DS.attr({ defaultValue: defaultQuantityGroups }),

  costPerUnit: computed('purchaseCost', 'originalQuantity', function() {
    let purchaseCost = this.get('purchaseCost');
    let quantity = parseInt(this.get('originalQuantity'));
    if (Ember.isEmpty(purchaseCost) || Ember.isEmpty(quantity) || purchaseCost === 0 || quantity === 0) {
      return 0;
    }
    return this._numberFormat(purchaseCost / quantity, true);
  }),

  validations: {
    purchaseCost: {
      numericality: true
    },
    originalQuantity: {
      numericality: {
        greaterThanOrEqualTo: 0
      }
    },
    vendor: {
      presence: true
    }
  }
});

export default InventoryPurchaseItem;
