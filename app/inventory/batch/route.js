import { resolve } from 'rsvp';
import InventoryRequestRoute from 'hospitalrun/inventory/request/route';
import { translationMacro as t } from 'ember-i18n';
export default InventoryRequestRoute.extend({
  editTitle: t('navigation.subnav.inventoryReceived'),
  modelName: 'inventory-batch',
  newTitle: t('navigation.subnav.inventoryReceived'),
  getNewData() {
    return resolve({
      invoiceItems: [],
      dateReceived: new Date()
    });
  },

  actions: {
    addedNewInventoryItem(model) {
      this.controller.send('addedNewInventoryItem', model);
    }
  }
});
