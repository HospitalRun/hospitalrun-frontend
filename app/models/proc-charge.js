import { isEmpty } from '@ember/utils';
import { get, computed } from '@ember/object';
import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import MedicationDetails from 'hospitalrun/mixins/medication-details';

/**
 * Procedure charges
 */
export default AbstractModel.extend(MedicationDetails, {
  // Attributes
  quantity: DS.attr('number'),
  dateCharged: DS.attr('date'),

  // Associations
  medication: DS.belongsTo('inventory', { async: false }),
  pricingItem: DS.belongsTo('pricing', { async: false }),

  medicationCharge: computed('medication', 'newMedicationCharge', function() {
    let medication = get(this, 'medication');
    let newMedicationCharge = get(this, 'newMedicationCharge');
    return !isEmpty(medication) || !isEmpty(newMedicationCharge);
  }),

  medicationName: computed('medication', function() {
    return this.get('medication.name');
  }),

  medicationPrice: computed('medication', function() {
    return this.get('medication.price');
  }),

  validations: {
    itemName: {
      presence: true,
      acceptance: {
        accept: true,
        if(object) {
          let medicationCharge = get(object, 'medicationCharge');
          if (!medicationCharge || !get(object, 'hasDirtyAttributes')) {
            return false;
          }
          let itemName = get(object, 'inventoryItem.name');
          let itemTypeAhead = get(object, 'itemName');
          if (isEmpty(itemName) || isEmpty(itemTypeAhead)) {
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
