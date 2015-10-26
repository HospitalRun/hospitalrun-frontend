import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';

export default AbstractEditController.extend({
  inventoryController: Ember.inject.controller('inventory'),
  cancelAction: 'closeModal',

  canEditQuantity: function() {
    var originalQuantity = this.get('model.originalQuantity'),
      currentQuantity = this.get('model.currentQuantity');
    if (currentQuantity < originalQuantity) {
      return false;
    }
    return true;
  }.property('model.currentQuantity', 'model.originalQuantity'),

  warehouseList: Ember.computed.alias('inventoryController.warehouseList'),
  aisleLocationList: Ember.computed.alias('inventoryController.aisleLocationList'),
  vendorList: Ember.computed.alias('inventoryController.vendorList'),

  lookupListsToUpdate: [{
    name: 'aisleLocationList', // Name of property containing lookup list
    property: 'model.aisleLocation', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'aisle_location_list' // Id of the lookup list to update
  }, {
    name: 'vendorList', // Name of property containing lookup list
    property: 'model.vendor', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'vendor_list' // Id of the lookup list to update
  }, {
    name: 'warehouseList', // Name of property containing lookup list
    property: 'model.location', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'warehouse_list' // Id of the lookup list to update
  }],

  newPurchase: false,

  updateQuantity: false,

  updateCapability: 'add_inventory_purchase',

  title: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return 'Add Purchase';
    }
    return 'Edit Purchase';
  }.property('model.isNew'),

  beforeUpdate: function() {
    var isNew = this.get('model.isNew'),
      changedAttributes = this.get('model').changedAttributes();
    if (changedAttributes.originalQuantity) {
      this.set('model.currentQuantity', this.get('model.originalQuantity'));
      if (!isNew) {
        this.set('updateQuantity', true);
      }
    }
    if (isNew) {
      this.set('newPurchase', true);
    }
    return Ember.RSVP.Promise.resolve();
  },

  afterUpdate: function(record) {
    if (this.get('newPurchase')) {
      this.send('addPurchase', record);
    } else {
      this.send('updatePurchase', record, true);
    }
  }
});
