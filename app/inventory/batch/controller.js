import { all } from 'rsvp';
import EmberObject, { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import InventoryId from 'hospitalrun/mixins/inventory-id';
import InventoryLocations from 'hospitalrun/mixins/inventory-locations';
import { t } from 'hospitalrun/macro';

export default AbstractEditController.extend(InventoryId, InventoryLocations, {
  doingUpdate: false,
  inventoryController: controller('inventory'),
  inventoryItems: null,
  warehouseList: alias('inventoryController.warehouseList'),
  aisleLocationList: alias('inventoryController.aisleLocationList'),
  vendorList: alias('inventoryController.vendorList'),
  purchaseAttributes: [
    'expirationDate',
    'inventoryItem',
    'lotNumber',
    'purchaseCost',
    'quantity',
    'vendorItemNo'
  ],

  inventoryList: computed('inventoryItems.[]', function() {
    let inventoryItems = this.get('inventoryItems');
    if (!isEmpty(inventoryItems)) {
      let mappedItems = inventoryItems.map(function(item) {
        return item.doc;
      });
      return mappedItems;
    }
  }),

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

  showDistributionUnit: computed('model.inventoryItemTypeAhead', 'model.inventoryItem', function() {
    return this._haveValidInventoryItem();
  }),

  showInvoiceItems: computed('model.invoiceItems.[]', function() {
    let invoiceItems = this.get('model.invoiceItems');
    return !isEmpty(invoiceItems);
  }),

  totalReceived: computed('model.invoiceItems.[].purchaseCost', 'model.isValid', 'model.purchaseCost', function() {
    let invoiceItems = this.get('model.invoiceItems');
    let total = 0;
    if (!isEmpty('invoiceItems')) {
      total = invoiceItems.reduce(function(previousValue, item) {
        return previousValue + Number(item.get('purchaseCost'));
      }, total);
    }
    let purchaseCost = this.get('model.purchaseCost');
    if (this.get('model.isValid') && !isEmpty(purchaseCost)) {
      total += Number(purchaseCost);
    }
    return total;
  }),

  updateButtonText: t('inventory.labels.save'),

  updateCapability: 'add_inventory_item',

  _addNewInventoryItem() {
    this.generateId().then(function(inventoryId) {
      let inventoryItem = this.store.createRecord('inventory', {
        id: inventoryId,
        name: this.get('model.inventoryItemTypeAhead'),
        quantity: 0, // Needed for validation purposes
        skipSavePurchase: true
      });
      this.send('openModal', 'inventory.quick-add', inventoryItem);
    }.bind(this));
  },

  _addInventoryItem() {
    let model = this.get('model');
    let inventoryItemTypeAhead = this.get('model.inventoryItemTypeAhead');
    let purchaseCost = this.get('model.purchaseCost');
    let quantity = this.get('model.quantity');
    return model.validate().then(function() {
      if (this.get('model.isValid') && !isEmpty(inventoryItemTypeAhead) && !isEmpty(quantity) && !isEmpty(purchaseCost)) {
        if (this._haveValidInventoryItem()) {
          this._addInvoiceItem();
        } else {
          this._addNewInventoryItem();
          return true;
        }
      } else {
        throw Error('invalid');
      }
    }.bind(this)).catch(function() {
      this.displayAlert(this.get('intl').t('inventory.titles.warning'), this.get('intl').t('inventory.messages.warning'));
    }.bind(this));
  },

  _addInvoiceItem() {
    let model = this.get('model');
    let invoiceItems = model.get('invoiceItems');
    let itemProperties = model.getProperties(this.get('purchaseAttributes'));
    let invoiceItem = EmberObject.create(itemProperties);
    invoiceItems.addObject(invoiceItem);
    model.set('expirationDate');
    model.set('inventoryItem');
    model.set('inventoryItemTypeAhead');
    model.set('lotNumber');
    model.set('purchaseCost');
    model.set('quantity');
    model.set('selectedInventoryItem');
    model.set('vendorItemNo');
  },

  _findInventoryItem(purchase) {
    let invoiceItems = this.get('model.invoiceItems');
    let inventoryId = purchase.get('inventoryItem');
    if (!isEmpty(inventoryId)) {
      let invoiceItem = invoiceItems.find(function(item) {
        return (item.get('inventoryItem.id') === inventoryId);
      }, this);
      if (!isEmpty(invoiceItem)) {
        return invoiceItem.get('inventoryItem');
      }
    }
  },

  _haveValidInventoryItem() {
    let inventoryItemTypeAhead = this.get('model.inventoryItemTypeAhead');
    let inventoryItem = this.get('model.inventoryItem');
    if (isEmpty(inventoryItemTypeAhead) || isEmpty(inventoryItem)) {
      return false;
    } else {
      let inventoryItemName = inventoryItem.get('name');
      let typeAheadName = inventoryItemTypeAhead.substr(0, inventoryItemName.length);
      if (typeAheadName !== inventoryItemName) {
        return false;
      } else {
        return true;
      }
    }
  },

  _savePurchases() {
    let model = this.get('model');
    let purchaseDefaults = model.getProperties([
      'dateReceived',
      'vendor',
      'invoiceNo',
      'location',
      'aisleLocation',
      'giftInKind']);
    let invoiceItems = model.get('invoiceItems');
    let inventoryPurchase;
    let savePromises = [];
    invoiceItems.forEach(function(invoiceItem) {
      let inventoryItem = invoiceItem.get('inventoryItem');
      let quantity = invoiceItem.get('quantity');
      inventoryPurchase = this.store.createRecord('inv-purchase', purchaseDefaults);
      inventoryPurchase.setProperties(invoiceItem.getProperties(this.get('purchaseAttributes')));
      inventoryPurchase.setProperties({
        distributionUnit: inventoryItem.get('distributionUnit'),
        currentQuantity: quantity,
        originalQuantity: quantity,
        inventoryItem: inventoryItem.get('id')
      });
      savePromises.push(inventoryPurchase.save());
    }.bind(this));
    all(savePromises).then(function(results) {
      let inventorySaves = [];
      let purchasesAdded = [];
      results.forEach(function(newPurchase) {
        let inventoryItem = this._findInventoryItem(newPurchase);
        let purchases = inventoryItem.get('purchases');
        purchases.addObject(newPurchase);
        purchasesAdded.push(this.newPurchaseAdded(inventoryItem, newPurchase));
      }.bind(this));

      all(inventorySaves).then(function() {
        results.forEach(function(newPurchase) {
          let inventoryItem = this._findInventoryItem(newPurchase);
          inventoryItem.updateQuantity();
          inventorySaves.push(inventoryItem.save());
        }.bind(this));
        all(inventorySaves).then(function() {
          this.updateLookupLists();
          this.displayAlert(this.get('intl').t('inventory.titles.purchaseSaved'), this.get('intl').t('inventory.messages.purchaseSaved'), 'allItems');
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },

  actions: {
    addInventoryItem() {
      this._addInventoryItem();
    },

    addedNewInventoryItem(inventoryItem) {
      this.set('model.inventoryItem', inventoryItem);
      this._addInvoiceItem();
      this.send('closeModal');
      if (this.get('doingUpdate')) {
        this._savePurchases();
      }
    },

    removeItem(removeInfo) {
      let invoiceItems = this.get('model.invoiceItems');
      let item = removeInfo.itemToRemove;
      invoiceItems.removeObject(item);
      this.send('closeModal');
    },

    showRemoveItem(item) {
      let message = this.get('intl').t('inventory.messages.removeItem');
      let model = EmberObject.create({
        itemToRemove: item
      });
      let title = this.get('intl').t('inventory.titles.removeItem');
      this.displayConfirm(title, message, 'removeItem', model);
    },

    /**
     * Update the model
     */
    update() {
      this.set('doingUpdate', true);
      this._addInventoryItem().then(function(addingNewInventory) {
        if (!addingNewInventory) {
          this._savePurchases();
        }
      }.bind(this));
    }
  }
});
