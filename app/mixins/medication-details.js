import { Promise as EmberPromise } from 'rsvp';
import Mixin from '@ember/object/mixin';
import { isEmpty } from '@ember/utils';
import DS from 'ember-data';

export default Mixin.create({
  // Denormalized medication details so that inventory records do not need to be retrieved

  /**
   * Does not return name on first call if medicationName is
   * not set and name is obtained via inventoryAttribute
   * Additional calls will return the name as medicationName
   * will then be set
   */
  getMedicationName(inventoryAttribute) {
    let medicationTitle = this.get('medicationTitle');
    if (!isEmpty(medicationTitle)) {
      return medicationTitle;
    } else {
      let inventoryObject = this.get(inventoryAttribute);
      if (inventoryObject.then) {
        inventoryObject.then((inventoryItem) => {
          if (!isEmpty(inventoryItem)) {
            this.set('medicationTitle', inventoryItem.get('name'));
          }
        }).catch((err) => {
          console.log('error getting inventory item for medication name:', err);
        });
      } else {
        this.set('medicationTitle', inventoryObject.get('name'));
      }
    }
  },

  /**
   * Does not return name on first call if priceOfMedication is
   * not set and price is obtained via inventoryAttribute
   * Additional calls will return the price as priceOfMedication
   * will then be set
   */
  getMedicationPrice(inventoryAttribute) {
    let priceOfMedication = this.get('priceOfMedication');
    if (!isEmpty(priceOfMedication)) {
      return priceOfMedication;
    } else {
      let inventoryObject = this.get(inventoryAttribute);
      if (inventoryObject.then) {
        inventoryObject.then((inventoryItem) => {
          this.set('priceOfMedication', inventoryItem.get('price'));
        });
      } else {
        this.set('priceOfMedication', inventoryObject.get('price'));
      }
    }
  },

  getMedicationDetails(inventoryAttribute) {
    return new EmberPromise((resolve) => {
      let medicationTitle = this.get('medicationTitle');
      let priceOfMedication = this.get('priceOfMedication');
      if (!isEmpty(medicationTitle) && !isEmpty(priceOfMedication)) {
        resolve({
          name: medicationTitle,
          price: priceOfMedication
        });
      } else {
        let objectInventoryItem = this.get(inventoryAttribute);
        if (objectInventoryItem.then) {
          objectInventoryItem.then((inventoryItem) => {
            resolve({
              name: inventoryItem.get('name'),
              price: inventoryItem.get('price')
            });
          });
        } else {
          resolve({
            name: objectInventoryItem.get('name'),
            price: objectInventoryItem.get('price')
          });
        }
      }
    });
  },

  medicationTitle: DS.attr('string'),
  priceOfMedication: DS.attr('number'),
  rxNormIdentifier: DS.attr('string')
});
