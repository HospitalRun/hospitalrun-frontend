import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
import LocationName from 'hospitalrun/mixins/location-name';

const { computed, get } = Ember;
/**
 * Model to represent the location(s) of inventory items.
 * File/model name is inv-location because using inv-location will cause location
 * items to be shown as inventory items since the pouchdb adapter does a
 * retrieve for keys starting with 'inventory' to fetch inventory items.
 */
let InventoryLocation = AbstractModel.extend(LocationName, {
  quantity: DS.attr('number'),
  location: DS.attr('string'),
  aisleLocation: DS.attr('string'),
  i18n: Ember.inject.service(),

  locationNameWithQuantity: computed('locationName', 'quantity', function() {
    let quantity = get(this, 'quantity');
    let locationName = get(this, 'locationName');
    return `${locationName} (${get(this, 'i18n').t('inventory.labels.availableQuantity', { quantity })})`;
  }),

  validations: {
    adjustmentQuantity: {
      numericality: {
        greaterThan: 0,
        messages: {
          greaterThan: 'must be greater than 0'
        }
      },
      acceptance: {
        /**
         * Validate that the adjustment quantity is a number and that if a deduction there are enough items to deduct
         */
        accept: true,
        if(object) {
          let adjustmentQuantity = get(object, 'adjustmentQuantity');
          let transactionType = get(object, 'transactionType');
          let locationQuantity = get(object, 'quantity');
          if (Ember.isEmpty(adjustmentQuantity) || isNaN(adjustmentQuantity)) {
            return true;
          }
          if (transactionType !== 'Adjustment (Add)' && adjustmentQuantity > locationQuantity) {
            return true;
          }
          return false;
        },
        message: 'Invalid quantity'
      }
    },

    dateCompleted: {
      presence: {
        message: 'Please provide a date'
      }
    },

    transferLocation: {
      acceptance: {
        accept: true,
        if(object) {
          let transferLocation = get(object, 'transferLocation');
          let transferItem = get(object, 'transferItem');
          // If we don't have a transfer item, then a transfer is not occurring.
          return !Ember.isEmpty(transferItem) && Ember.isEmpty(transferLocation);
        },
        message: 'Please select a location to transfer to'
      }
    }
  }
});

export default InventoryLocation;
