import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import FulfillRequest from 'hospitalrun/mixins/fulfill-request';
import InventoryId from 'hospitalrun/mixins/inventory-id';
import InventoryLocations from 'hospitalrun/mixins/inventory-locations'; // inventory-locations mixin is needed for fulfill-request mixin!
export default AbstractModuleRoute.extend(FulfillRequest, InventoryId, InventoryLocations, {
  addCapability: 'add_inventory_item',
  additionalButtons: function() {
    if (this.currentUserCan(this.get('addCapability'))) {
      return [{
        buttonAction: 'newInventoryBatch',
        buttonText: '+ inventory received',
        class: 'btn btn-primary'
      }];
    }
  }.property(),

  additionalModels: [{
    name: 'aisleLocationList',
    findArgs: ['lookup', 'aisle_location_list']
  }, {
    name: 'expenseAccountList',
    findArgs: ['lookup', 'expense_account_list']
  }, {
    name: 'inventoryTypeList',
    findArgs: ['lookup', 'inventory_types']
  }, {
    name: 'inventoryUnitList',
    findArgs: ['lookup', 'unit_types']
  }, {
    name: 'warehouseList',
    findArgs: ['lookup', 'warehouse_list']
  }, {
    name: 'vendorList',
    findArgs: ['lookup', 'vendor_list']
  }],

  currentItem: null,
  moduleName: 'inventory',

  newButtonText: '+ new request',
  sectionTitle: 'Inventory',

  actions: {
    addPurchase: function(newPurchase) {
      let currentItem = this.get('currentItem');
      let purchases = currentItem.get('purchases');
      purchases.addObject(newPurchase);
      this.newPurchaseAdded(currentItem, newPurchase).then(function() {
        currentItem.updateQuantity();
        currentItem.save().then(function() {
          this.send('closeModal');
        }.bind(this));
      }.bind(this));
    },

    newInventoryBatch: function() {
      if (this.currentUserCan(this.get('addCapability'))) {
        this.transitionTo('inventory.batch', 'new');
      }
    },

    newRequest: function() {
      this.transitionTo('inventory.request', 'new');
    },

    allItems: function() {
      this.transitionTo('inventory.listing');
    },

    showAddPurchase: function(inventoryItem) {
      let newPurchase = this.get('store').createRecord('inv-purchase', {
        dateReceived: new Date(),
        distributionUnit: inventoryItem.get('distributionUnit'),
        inventoryItem: inventoryItem.get('id')
      });
      this.set('currentItem', inventoryItem);
      this.send('openModal', 'inventory.purchase.edit', newPurchase);
    }
  }
});
