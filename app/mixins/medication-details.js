import Ember from 'ember';
import DS from 'ember-data';
export default Ember.Mixin.create({
  // Denormalized medication details so that inventory records do not need to be retrieved
  getMedicationName: function(inventoryAttribute) {
    let medicationTitle = this.get('medicationTitle');
    if (!Ember.isEmpty(medicationTitle)) {
      return medicationTitle;
    } else {
      let inventoryObject = this.get(inventoryAttribute);
      if (inventoryObject.then) {
        this.get(inventoryAttribute).then((inventoryItem) => {
          this.set('medicationTitle', inventoryItem.get('name'));
        });
      } else {
        this.set('medicationTitle', inventoryObject.get('name'));
      }
    }
  },

  getMedicationPrice: function(inventoryAttribute) {
    let priceOfMedication = this.get('priceOfMedication');
    if (!Ember.isEmpty(priceOfMedication)) {
      return priceOfMedication;
    } else {
      this.get(inventoryAttribute).then((inventoryItem) => {
        this.set('priceOfMedication', inventoryItem.get('price'));
      });
    }
  },

  getMedicationDetails: function(inventoryAttribute) {
    return new Ember.RSVP.Promise((resolve) => {
      let medicationTitle = this.get('medicationTitle');
      let priceOfMedication = this.get('priceOfMedication');
      if (!Ember.isEmpty(medicationTitle) && !Ember.isEmpty(priceOfMedication)) {
        resolve({
          name: medicationTitle,
          price: priceOfMedication
        });
      } else {
        let objectInventoryItem = this.get(inventoryAttribute);
        if (objectInventoryItem.then) {
          this.get(inventoryAttribute).then((inventoryItem) => {
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
  priceOfMedication: DS.attr('number')
});
