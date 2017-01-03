import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
import LocationName from 'hospitalrun/mixins/location-name';
import NumberFormat from 'hospitalrun/mixins/number-format';

const { computed, get } = Ember;

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
  // Attributes
  aisleLocation: DS.attr('string'),
  currentQuantity: DS.attr('number'),
  dateReceived: DS.attr('date'),
  distributionUnit: DS.attr('string'),
  expirationDate: DS.attr('date'),
  expired: DS.attr('boolean'),
  giftInKind: DS.attr('boolean'),
  invoiceNo: DS.attr('string'),
  location: DS.attr('string'),
  lotNumber: DS.attr('string'),
  originalQuantity: DS.attr('number'),
  purchaseCost: DS.attr('number'),
  quantityGroups: DS.attr({ defaultValue: defaultQuantityGroups }),
  inventoryItem: DS.attr('string'), // Currently just storing id instead of DS.belongsTo('inventory', { async: true }),
  vendor: DS.attr('string'),
  vendorItemNo: DS.attr('string'),
  costPerUnit: computed('purchaseCost', 'originalQuantity', function() {
    let purchaseCost = get(this, 'purchaseCost');
    let quantity = parseInt(get(this, 'originalQuantity'));
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
