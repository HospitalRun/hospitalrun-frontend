import { isEmpty } from '@ember/utils';
import { get, computed } from '@ember/object';
import AbstractModel from 'hospitalrun/models/abstract';
import CanEditRequested from 'hospitalrun/mixins/can-edit-requested';
import DS from 'ember-data';
import DateFormat from 'hospitalrun/mixins/date-format';
import MedicationDetails from 'hospitalrun/mixins/medication-details';

export default AbstractModel.extend(CanEditRequested, DateFormat, MedicationDetails, {
  // Attributes
  notes: DS.attr('string'),
  prescription: DS.attr('string'),
  prescriptionDate: DS.attr('date'),
  quantity: DS.attr('number'),
  refills: DS.attr('number'),
  requestedDate: DS.attr('date'),
  requestedBy: DS.attr('string'),
  status: DS.attr('string'),

  // Associations
  inventoryItem: DS.belongsTo('inventory', { async: true }),
  patient: DS.belongsTo('patient', { async: false }),
  visit: DS.belongsTo('visit', { async: false }),

  isRequested: computed('status', function() {
    return get(this, 'status') === 'Requested';
  }),

  medicationName: computed('medicationTitle', 'inventoryItem', function() {
    return this.getMedicationName('inventoryItem');
  }),

  medicationPrice: computed('priceOfMedication', 'inventoryItem', function() {
    return this.getMedicationPrice('inventoryItem');
  }),

  prescriptionDateAsTime: computed('prescriptionDate', function() {
    return this.dateToTime(get(this, 'prescriptionDate'));
  }),

  requestedDateAsTime: computed('requestedDate', function() {
    return this.dateToTime(get(this, 'requestedDate'));
  }),

  validations: {
    prescription: {
      acceptance: {
        accept: true,
        if(object) {
          if (!get(object, 'hasDirtyAttributes') || get(object, 'isFulfilling')) {
            return false;
          }
          let prescription = get(object, 'prescription');
          let quantity = get(object, 'quantity');
          return isEmpty(prescription) && isEmpty(quantity);
        },
        message: 'Please enter a prescription or a quantity'
      }
    },

    inventoryItemTypeAhead: {
      acceptance: {
        accept: true,
        if(object) {
          if (!get(object, 'hasDirtyAttributes') || !get(object, 'isNew')) {
            return false;
          }
          let itemName = get(object, 'inventoryItem.name');
          let itemTypeAhead = get(object, 'inventoryItemTypeAhead');
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

    patientTypeAhead: {
      presence: {
        if(object) {
          return get(object, 'selectPatient');
        }
      }
    },

    quantity: {
      numericality: {
        allowBlank: true,
        greaterThan: 0,
        messages: {
          greaterThan: 'must be greater than 0'
        }
      },
      presence: {
        if(object) {
          return get(object, 'isFulfilling');
        }
      },
      acceptance: {
        accept: true,
        if(object) {
          let isFulfilling = get(object, 'isFulfilling');
          let requestQuantity = parseInt(get(object, 'quantity'));
          let quantityToCompare = null;

          if (!isFulfilling) {
            // no validation needed when not fulfilling
            return false;
          } else {
            quantityToCompare = object.get('inventoryItem.quantity');
          }

          if (requestQuantity > quantityToCompare) {
            // force validation to fail
            return true;
          } else {
            // There is enough quantity on hand
            return false;
          }
        },
        message: 'The quantity must be less than or equal to the number of available medication.'
      }
    },

    refills: {
      numericality: {
        allowBlank: true
      }
    }
  }
});
