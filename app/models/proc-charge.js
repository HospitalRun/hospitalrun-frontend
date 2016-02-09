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
    let medicationTitle = this.get('medicationTitle');
    if (!Ember.isEmpty(medicationTitle)) {
      return true;
    }
    var pricingItem = this.get('pricingItem'),
      newMedicationCharge = this.get('newMedicationCharge');
    return (Ember.isEmpty(pricingItem) || newMedicationCharge);
  }.property('medicationTitle', 'pricingItem', 'newMedicationCharge'),

  medicationName: function() {
    return this.getMedicationName('medication');
  }.property('medicationTitle', 'medication'),

  medicationPrice: function() {
    return this.getMedicationPrice('medication');
  }.property('priceOfMedication', 'medication'),

  validations: {
    itemName: {
      presence: true,
      acceptance: {
        accept: true,
        if: function(object) {
          var medicationCharge = object.get('medicationCharge');
          if (!medicationCharge || !object.get('hasDirtyAttributes')) {
            return false;
          }
          var itemName = object.get('inventoryItem.name'),
            itemTypeAhead = object.get('itemName');
          if (Ember.isEmpty(itemName) || Ember.isEmpty(itemTypeAhead)) {
            // force validation to fail
            return true;
          } else {
            var typeAheadName = itemTypeAhead.substr(0, itemName.length);
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
