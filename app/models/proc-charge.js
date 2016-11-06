import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
import MedicationDetails from 'hospitalrun/mixins/medication-details';

/**
 * Procedure charges
 */
export default AbstractModel.extend(MedicationDetails, {
  medication: DS.belongsTo('inventory', {
    async: false
  }),
  pricingItem: DS.belongsTo('pricing', {
    async: false
  }),
  quantity: DS.attr('number'),
  dateCharged: DS.attr('date'),

  medicationCharge: function() {
    let medication = this.get('medication');
    let newMedicationCharge = this.get('newMedicationCharge');
    return (!Ember.isEmpty(medication) || !Ember.isEmpty(newMedicationCharge));
  }.property('medication', 'newMedicationCharge'),

  medicationName: function() {
    return this.get('medication.name');
  }.property('medication'),

  medicationPrice: function() {
    return this.get('medication.price');
  }.property('medication'),

  validations: {
    itemName: {
      presence: true,
      acceptance: {
        accept: true,
        if: function(object) {
          let medicationCharge = object.get('medicationCharge');
          if (!medicationCharge || !object.get('hasDirtyAttributes')) {
            return false;
          }
          let itemName = object.get('inventoryItem.name');
          let itemTypeAhead = object.get('itemName');
          if (Ember.isEmpty(itemName) || Ember.isEmpty(itemTypeAhead)) {
            // force validation to fail
            return true;
          } else {
            let typeAheadName = itemTypeAhead.substr(0, itemName.length);
            if (itemName !== typeAheadName) {
              return true;
            }
          }
          // Inventory item is properly selected; don't do any further validation
          return false;
        },
        message: 'Please select a valid medication'
      }

    },

    quantity: {
      numericality: {
        greaterThan: 0,
        messages: {
          greaterThan: 'must be greater than 0'
        }
      }
    }
  }
});
