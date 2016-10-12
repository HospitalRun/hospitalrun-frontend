import AbstractModel from 'hospitalrun/models/abstract';
import AdjustmentTypes from 'hospitalrun/mixins/inventory-adjustment-types';
import DS from 'ember-data';
import Ember from 'ember';
import LocationName from 'hospitalrun/mixins/location-name';
/**
 * Model to represent a request for inventory items.
 */
let InventoryRequest = AbstractModel.extend(AdjustmentTypes, LocationName, {
  adjustPurchases: DS.attr('boolean'),
  completedBy: DS.attr('string'),
  costPerUnit: DS.attr('number'),
  dateCompleted: DS.attr('date'),
  dateRequested: DS.attr('date'),
  deliveryAisle: DS.attr('string'),
  deliveryLocation: DS.attr('string'),
  expenseAccount: DS.attr('string'),
  inventoryItem: DS.belongsTo('inventory', { async: true }),
  locationsAffected: DS.attr(),
  markAsConsumed: DS.attr('boolean', { defaultValue: true }),
  patient: DS.belongsTo('patient', {
    async: false
  }),
  purchasesAffected: DS.attr(),
  quantity: DS.attr('number'),
  quantityAtCompletion: DS.attr('number'),
  reason: DS.attr('string'),
  requestedBy: DS.attr('string'),
  status: DS.attr('string'),
  transactionType: DS.attr('string'),
  visit: DS.belongsTo('visit', {
    async: false
  }),

  deliveryLocationName: function() {
    let aisle = this.get('deliveryAisle');
    let location = this.get('deliveryLocation');
    return this.formatLocationName(location, aisle);
  }.property('deliveryAisle', 'deliveryLocation'),

  deliveryDetails: function() {
    let locationName = this.get('deliveryLocationName');
    let patient = this.get('patient');
    if (Ember.isEmpty(patient)) {
      return locationName;
    } else {
      return patient.get('displayName');
    }
  }.property('deliveryAisle', 'deliveryLocation', 'patient'),

  haveReason: function() {
    return !Ember.isEmpty(this.get('reason'));
  }.property('reason'),

  isAdjustment: function() {
    let adjustmentTypes = this.get('adjustmentTypes');
    let transactionType = this.get('transactionType');
    let adjustmentType = adjustmentTypes.findBy('type', transactionType);
    return !Ember.isEmpty(adjustmentType);
  }.property('transactionType'),

  isFulfillment: function() {
    return this.get('transactionType') === 'Fulfillment';
  }.property('transactionType'),

  isTransfer: function() {
    return this.get('transactionType') === 'Transfer';
  }.property('transactionType'),

  validations: {
    inventoryItemTypeAhead: {
      acceptance: {
        accept: true,
        if: function(object) {
          if (!object.get('hasDirtyAttributes')) {
            return false;
          }
          let itemName = object.get('inventoryItem.name');
          let itemTypeAhead = object.get('inventoryItemTypeAhead');
          let requestedItems = object.get('requestedItems');
          let status = object.get('status');
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
        if: function(object) {
          let requestedItems = object.get('requestedItems');
          return (Ember.isEmpty(requestedItems));
        }
      },
      acceptance: {
        accept: true,
        if: function(object) {
          let isNew = object.get('isNew');
          let requestQuantity = parseInt(object.get('quantity'));
          let transactionType = object.get('transactionType');
          let quantityToCompare = null;
          if (transactionType === 'Return') {
            // no validation needed for returns
            return false;
          } else if (isNew && transactionType === 'Request') {
            quantityToCompare = object.get('inventoryItem.quantity');
          } else {
            quantityToCompare = object.get('inventoryLocation.quantity');
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
