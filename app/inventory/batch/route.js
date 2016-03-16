import InventoryRequestRoute from 'hospitalrun/inventory/request/route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
export default InventoryRequestRoute.extend({
  editTitle: t('navigation.subnav.inventory_received'),
  modelName: 'inventory-batch',
  newTitle: t('navigation.subnav.inventory_received'),
  getNewData: function() {
    return Ember.RSVP.resolve({
      invoiceItems: [],
      dateReceived: new Date()
    });
  },

  actions: {
    addedNewInventoryItem: function(model) {
      this.controller.send('addedNewInventoryItem', model);
    }
  }
});
