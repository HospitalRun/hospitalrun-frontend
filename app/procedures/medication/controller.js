import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import InventorySelection from 'hospitalrun/mixins/inventory-selection';
import Ember from 'ember';

export default AbstractEditController.extend(InventorySelection, {
  needs: ['procedures/edit'],
  cancelAction: 'closeModal',
  newPricingItem: false,
  requestingController: Ember.computed.alias('controllers.procedures/edit'),
  medicationList: Ember.computed.alias('controllers.procedures/edit.medicationList'),

  updateCapability: 'add_charge',

  medicationChanged: function () {
    var itemName = this.get('itemName'),
      medication = this.get('medication');
    if (!Ember.isEmpty(medication) && medication.get('name') !== itemName) {
      this.set('itemName', medication.get('name'));
    }
  }.observes('medication'),

  title: function () {
    var isNew = this.get('isNew');
    if (isNew) {
      return 'Add Medication Used';
    }
    return 'Edit Medication Used';
  }.property('isNew'),

  beforeUpdate: function () {
    var isNew = this.get('isNew');
    if (isNew) {
      this.set('newCharge', true);
    }
    return Ember.RSVP.Promise.resolve();
  },

  afterUpdate: function (record) {
    if (this.get('newCharge')) {
      this.get('requestingController').send('addCharge', record);
    } else {
      this.send('closeModal');
    }
  }
});
