import { resolve } from 'rsvp';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import { t } from 'hospitalrun/macro';
import InventoryId from 'hospitalrun/mixins/inventory-id';
export default AbstractEditRoute.extend(InventoryId, {
  editTitle: t('inventory.labels.editItem'),
  modelName: 'inventory',
  newTitle: t('inventory.labels.newItem'),

  actions: {
    adjustItems(inventoryLocation) {
      this.controller.send('adjustItems', inventoryLocation);
    },

    doneFulfillRequest() {
      this.controller.getTransactions();
    },

    editNewItem() {
      this.controller.send('editNewItem');
    },

    transferItems(inventoryLocation) {
      this.controller.send('transferItems', inventoryLocation);
    },

    updatePurchase(purchase, updateQuantity) {
      this.controller.send('updatePurchase', purchase, updateQuantity);
    }
  },

  getNewData() {
    return resolve({
      dateReceived: new Date(),
      quantityGroups: []
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.getTransactions();
  }
});
