import AbstractModel from 'hospitalrun/models/abstract';
import AdjustmentTypes from 'hospitalrun/mixins/inventory-adjustment-types';
import DS from 'ember-data';
import Ember from 'ember';
import LocationName from 'hospitalrun/mixins/location-name';

const { computed, get } = Ember;
/**
 * Model to represent a request for inventory items.
 */
let InventoryRequest = AbstractModel.extend(AdjustmentTypes, LocationName, {
  // Attributes
  adjustPurchases: DS.attr('boolean'),
  completedBy: DS.attr('string'),
  costPerUnit: DS.attr('number'),
  dateCompleted: DS.attr('date'),
  dateRequested: DS.attr('date'),
  deliveryAisle: DS.attr('string'),
  deliveryLocation: DS.attr('string'),
  expenseAccount: DS.attr('string'),
  locationsAffected: DS.attr(),
  markAsConsumed: DS.attr('boolean', { defaultValue: true }),
  purchasesAffected: DS.attr(),
  quantity: DS.attr('number'),
  quantityAtCompletion: DS.attr('number'),
  reason: DS.attr('string'),
  requestedBy: DS.attr('string'),
  status: DS.attr('string'),
  transactionType: DS.attr('string'),
  // Associations
  inventoryItem: DS.belongsTo('inventory', { async: true }),
  patient: DS.belongsTo('patient', { async: false }),
  visit: DS.belongsTo('visit', { async: false }),

  deliveryLocationName: computed('deliveryAisle', 'deliveryLocation', function() {
    let aisle = get(this, 'deliveryAisle');
    let location = get(this, 'deliveryLocation');
    return this.formatLocationName(location, aisle);
  }),

  deliveryDetails: computed('deliveryAisle', 'deliveryLocation', 'patient', function() {
    let locationName = get(this, 'deliveryLocationName');
    let patient = get(this, 'patient');
    return Ember.isEmpty(patient) ? locationName : get(patient, 'displayName');
  }),

  haveReason: computed('reason', function() {
    return !Ember.isEmpty(get(this, 'reason'));
  }),

  isAdjustment: computed('transactionType', function() {
    let adjustmentTypes = get(this, 'adjustmentTypes');
    let transactionType = get(this, 'transactionType');
    let adjustmentType = adjustmentTypes.findBy('type', transactionType);
    return !Ember.isEmpty(adjustmentType);
  }),

  isFulfillment: computed('transactionType', function() {
    return get(this, 'transactionType') === 'Fulfillment';
  }),

  isTransfer: computed('transactionType', function() {
    return get(this, 'transactionType') === 'Transfer';
  }),

  validations: {
    inventoryItemTypeAhead: {
      acceptance: {
        accept: true,
        if(object) {
          if (!object.get('hasDirtyAttributes')) {
            return false;
          }
          let itemName = get(object, 'inventoryItem.name');
          let itemTypeAhead = get(object, 'inventoryItemTypeAhead');
          let requestedItems = get(object, 'requestedItems');
          let status = get(object, 'status');
          if (status === 'Requested') {
            // Requested items don't show the type ahead and therefore don't need validation.
            return false;
          }
          if (Ember.isEmpty(itemName) || Ember.isEmpty(itemTypeAhead)) {
            // force validation to fail if fields are empty and requested items are empty
            return Ember.isEmpty(requestedItems);
          } else {
            let typeAheadName = itemTypeAhead.substr(0, itemName.length);
            if (itemName !== typeAheadName) {
              return true;
            }
          }
          // Inventory item is properly selected; don't do any further validation
          return false;

        },
        message: 'Please select a valid inventory item'
      }
    },
    quantity: {
      numericality: {
        greaterThan: 0,
        messages: {
          greaterThan: 'must be greater than 0'
        },
        if(object) {
          let requestedItems = object.get('requestedItems');
          return (Ember.isEmpty(requestedItems));
        }
      },
      acceptance: {
        accept: true,
        if(object) {
          let isNew = get(object, 'isNew');
          let requestQuantity = parseInt(get(object, 'quantity'));
          let transactionType = get(object, 'transactionType');
          let quantityToCompare = null;
          if (transactionType === 'Return') {
            // no validation needed for returns
            return false;
          } else if (isNew && transactionType === 'Request') {
            quantityToCompare = get(object, 'inventoryItem.quantity');
          } else {
            quantityToCompare = get(object, 'inventoryLocation.quantity');
          }
          if (requestQuantity > quantityToCompare) {
            // force validation to fail
            return true;
          } else {
            // Diagnosis is properly set; don't do any further validation
            return false;
          }
        },
        message: 'The quantity must be less than or equal to the number of available items.'
      }
    }
  }
});

export default InventoryRequest;
