import Ember from 'ember';
import DS from 'ember-data';
export default Ember.Mixin.create({
  // Denormalized medication details so that inventory records do not need to be retrieved
  getMedicationName: function(inventoryAttribute) {
    let medicationTitle = this.get('medicationTitle');
    if (!Ember.isEmpty(medicationTitle)) {
      return medicationTitle;
    } else {
      this.get(inventoryAttribute).then((inventoryItem) => {
        this.set('medicationTitle', inventoryItem.get('name'));
      });
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
        this.get(inventoryAttribute).then((inventoryItem) => {
          resolve({
            name: inventoryItem.get('name'),
            price: inventoryItem.get('price')
          });
        });
      }
    });
  },

  medicationTitle: DS.attr('string'),
  priceOfMedication: DS.attr('number')
});
