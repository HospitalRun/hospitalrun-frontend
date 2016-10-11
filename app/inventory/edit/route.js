import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
import InventoryId from 'hospitalrun/mixins/inventory-id';
export default AbstractEditRoute.extend(InventoryId, {
  editTitle: t('inventory.labels.editItem'),
  modelName: 'inventory',
  newTitle: t('inventory.labels.newItem'),

  actions: {
    adjustItems: function(inventoryLocation) {
      this.controller.send('adjustItems', inventoryLocation);
    },

    doneFulfillRequest: function() {
      this.controller.getTransactions();
    },

    editNewItem: function() {
      this.controller.send('editNewItem');
    },

    transferItems: function(inventoryLocation) {
      this.controller.send('transferItems', inventoryLocation);
    },

    updatePurchase: function(purchase, updateQuantity) {
      this.controller.send('updatePurchase', purchase, updateQuantity);
    }
  },

  getNewData: function() {
    return Ember.RSVP.resolve({
      dateReceived: new Date()
    });
  },

  setupController: function(controller, model) {
    this._super(controller, model);
    controller.getTransactions();
  }
});
