import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import InventorySelection from 'hospitalrun/mixins/inventory-selection';
import Ember from 'ember';

export default AbstractEditController.extend(InventorySelection, {
  cancelAction: 'closeModal',
  newCharge: false,
  requestingController:  Ember.inject.controller('procedures/edit'),
  medicationList: Ember.computed.alias('requestingController.medicationList'),

  updateCapability: 'add_charge',

  title: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return 'Add Medication Used';
    }
    return 'Edit Medication Used';
  }.property('model.isNew'),

  beforeUpdate: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      this.set('newCharge', true);
      let model = this.get('model');
      let inventoryItem = model.get('inventoryItem');
      model.set('medication', inventoryItem);
      model.set('medicationTitle', inventoryItem.get('name'));
      model.set('priceOfMedication', inventoryItem.get('price'));
    }
    return Ember.RSVP.Promise.resolve();
  },

  afterUpdate: function(record) {
    if (this.get('newCharge')) {
      this.get('requestingController').send('addCharge', record);
    } else {
      this.send('closeModal');
    }
  }
});
