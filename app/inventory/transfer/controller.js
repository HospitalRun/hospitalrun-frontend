import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
export default AbstractEditController.extend({
  inventoryController: Ember.inject.controller('inventory'),

  warehouseList: Ember.computed.alias('inventoryController.warehouseList'),
  aisleLocationList: Ember.computed.alias('inventoryController.aisleLocationList'),

  lookupListsToUpdate: [{
    name: 'aisleLocationList', // Name of property containing lookup list
    property: 'model.transferAisleLocation', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'aisle_location_list' // Id of the lookup list to update
  }, {
    name: 'warehouseList', // Name of property containing lookup list
    property: 'model.transferLocation', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'warehouse_list' // Id of the lookup list to update
  }],

  title: t('inventory.titles.transfer'),
  updateButtonText: t('inventory.labels.transfer'),
  updateButtonAction: 'transfer',
  updateCapability: 'adjust_inventory_location',

  actions: {
    cancel: function() {
      this.send('closeModal');
    },

    transfer: function() {
      this.updateLookupLists();
      this.send('transferItems', this.get('model'), true);
    }
  }
});
