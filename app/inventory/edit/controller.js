import { all, Promise as EmberPromise } from 'rsvp';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import { get, computed } from '@ember/object';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import FriendlyId from 'hospitalrun/mixins/friendly-id';
import InventoryLocations from 'hospitalrun/mixins/inventory-locations';
import InventoryTypeList from 'hospitalrun/mixins/inventory-type-list';
import ReturnTo from 'hospitalrun/mixins/return-to';
import UnitTypes from 'hospitalrun/mixins/unit-types';
import UserSession from 'hospitalrun/mixins/user-session';

export default AbstractEditController.extend(FriendlyId, InventoryLocations, InventoryTypeList, ReturnTo, UnitTypes, UserSession, {
  inventory: controller(),
  savingNewItem: false,
  sequenceView: 'inventory_by_friendly_id',

  canAddPurchase: function() {
    return this.currentUserCan('add_inventory_purchase');
  }.property(),

  canAdjustLocation() {
    return this.currentUserCan('adjust_inventory_location');
  },

  warehouseList: alias('inventory.warehouseList'),
  aisleLocationList: alias('inventory.aisleLocationList'),
  inventoryTypeList: alias('inventory.inventoryTypeList.value'),
  inventoryUnitList: alias('inventory.inventoryUnitList.value'),
  vendorList: alias('inventory.vendorList'),
  database: service(),

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

  canEditQuantity: function() {
    return (this.get('model.isNew'));
  }.property('model.isNew'),

  haveTransactions: function() {
    let transactions = this.get('transactions');
    return transactions !== null;
  }.property('transactions.[]'),

  locationQuantityTotal: function() {
    let locations = this.get('model.locations');
    let total = locations.reduce(function(previousValue, location) {
      return previousValue + parseInt(location.get('quantity'));
    }, 0);
    return total;
  }.property('model.locations'),

  /**
   * Check to see if the total quantity by location matches the quantity calculated on the item
   * @return {boolean} true if there is a discrepency;otherwise false.
   */
  quantityDiscrepency: function() {
    let locationQuantityTotal = this.get('locationQuantityTotal');
    let quantity = this.get('model.quantity');
    return !isEmpty(locationQuantityTotal) && !isEmpty(quantity) && locationQuantityTotal !== quantity;
  }.property('locationQuantityTotal', 'model.quantity'),

  /**
   * Get the difference in quantity between the total quantity by location and the quantity on the item.
   * @return {int} the difference.
   */
  quantityDifferential: function() {
    let locationQuantityTotal = this.get('locationQuantityTotal');
    let quantity = this.get('model.quantity');
    return Math.abs(locationQuantityTotal - quantity);
  }.property('locationQuantityTotal', 'model.quantity'),

  originalQuantityUpdated: function() {
    let isNew = this.get('model.isNew');
    let quantity = this.get('model.originalQuantity');
    if (isNew && !isEmpty(quantity)) {
      this.set('model.quantity', quantity);
    }
  }.observes('model.isNew', 'model.originalQuantity'),

  sequenceName: computed('model.inventoryType', function() {
    let inventoryType = get(this, 'model.inventoryType');
    return `inventory_${inventoryType}`;
  }),

  showTransactions: function() {
    let transactions = this.get('transactions');
    return !isEmpty(transactions);
  }.property('transactions.[]'),

  transactions: null,

  updateCapability: 'add_inventory_item',

  actions: {
    adjustItems(inventoryLocation) {
      let adjustmentQuantity = parseInt(inventoryLocation.get('adjustmentQuantity'));
      let inventoryItem = this.get('model');
      let transactionType = inventoryLocation.get('transactionType');
      let request = this.get('store').createRecord('inv-request', {
        adjustPurchases: true,
        dateCompleted: inventoryLocation.get('dateCompleted'),
        expenseAccount: inventoryLocation.get('expenseAccount'),
        inventoryItem,
        quantity: adjustmentQuantity,
        transactionType,
        reason: inventoryLocation.get('reason'),
        deliveryAisle: inventoryLocation.get('aisleLocation'),
        deliveryLocation: inventoryLocation.get('location')
      });
      request.set('inventoryLocations', [inventoryLocation]);
      let increment = false;
      if (transactionType === 'Adjustment (Add)' || transactionType === 'Return') {
        increment = true;
      }
      request.set('markAsConsumed', true);
      // Make sure inventory item is resolved first.
      request.get('inventoryItem').then(function() {
        this.send('fulfillRequest', request, true, increment, true);
      }.bind(this));
    },

    editNewItem() {
      this.send('editItem', this.get('model.id'));
    },

    showAdjustment(inventoryLocation) {
      inventoryLocation.setProperties({
        dateCompleted: new Date(),
        adjustmentItem: this.get('model'),
        adjustmentQuantity: '',
        reason: '',
        transferItem: null,
        transactionType: 'Adjustment (Add)'
      });
      this.send('openModal', 'inventory.adjust', inventoryLocation);
    },

    showTransfer(inventoryLocation) {
      inventoryLocation.set('adjustmentQuantity');
      inventoryLocation.set('transferItem', this.get('model'));
      inventoryLocation.set('dateCompleted', new Date());
      this.send('openModal', 'inventory.transfer', inventoryLocation);
    },

    transferItems(inventoryLocation) {
      let inventoryItem = this.get('model');
      let request = this.get('store').createRecord('inv-request', {
        adjustPurchases: false,
        dateCompleted: inventoryLocation.get('dateCompleted'),
        inventoryItem,
        quantity: inventoryLocation.get('adjustmentQuantity'),
        deliveryAisle: inventoryLocation.get('transferAisleLocation'),
        deliveryLocation: inventoryLocation.get('transferLocation'),
        transactionType: 'Transfer'
      });
      this.transferToLocation(inventoryItem, inventoryLocation).then(function() {
        inventoryLocation.setProperties({
          transferItem: null,
          transferLocation: null,
          transferAisleLocation: null,
          adjustmentQuantity: null
        });
        request.set('locationsAffected', [{
          name: inventoryLocation.get('locationName'),
          quantity: request.get('quantity')
        }]);
        request.get('inventoryItem').then(function() {
          // Make sure relationships are resolved before saving
          this._saveRequest(request);
        }.bind(this));
      }.bind(this));
    },

    updatePurchase(purchase, updateQuantity) {
      if (updateQuantity) {
        this.get('model').updateQuantity();
        this.send('update', true);
      }
      this.send('closeModal');
    }
  },

  _completeBeforeUpdate(friendlyId) {
    let promises = [];
    let model = this.get('model');
    let newPurchase = model.getProperties('aisleLocation', 'dateReceived',
      'purchaseCost', 'lotNumber', 'expirationDate', 'giftInKind',
      'invoiceNo', 'location', 'originalQuantity', 'quantityGroups', 'vendor', 'vendorItemNo');
    let quantity = this.get('model.originalQuantity');
    if (!isEmpty(quantity)) {
      newPurchase.currentQuantity = quantity;
      newPurchase.inventoryItem = this.get('model.id');
      let purchase = this.get('store').createRecord('inv-purchase', newPurchase);
      promises.push(purchase.save());
      this.get('model.purchases').addObject(purchase);
      promises.push(this.newPurchaseAdded(this.get('model'), purchase));
    }
    model.set('friendlyId', friendlyId);
    return all(promises, 'All before update done for inventory item');
  },

  /**
   * Saves the specified request, then updates the inventory item and closes the modal.
   */
  _saveRequest(request) {
    request.set('status', 'Completed');
    request.set('completedBy', request.getUserName());
    request.save().then(function() {
      this.send('update', true);
      this.send('closeModal');
      this.getTransactions();
    }.bind(this));
  },

  getTransactions() {
    let inventoryId = this.get('model.id');
    this.set('transactions', null);
    this.store.query('inv-request', {
      options: {
        endkey: [inventoryId, 'Completed', 0],
        startkey: [inventoryId, 'Completed', 9999999999999],
        descending: true
      },
      mapReduce: 'inventory_request_by_item'
    }).then(function(transactions) {
      this.set('transactions', transactions);
    }.bind(this));
  },

  beforeUpdate() {
    if (this.get('model.isNew')) {
      let model = this.get('model');
      return model.validate().then(() => {
        if (model.get('isValid')) {
          this.set('savingNewItem', true);
          return this.generateFriendlyId('inventory').then((friendlyId) => {
            return this._completeBeforeUpdate(friendlyId);
          });
        } else {
          throw Error('invalid model');
        }
      }).catch(() => {
        this.send('showDisabledDialog');
      });
    } else {
      return EmberPromise.resolve();
    }
  },

  afterUpdate() {
    let afterUpdateAction = null;
    if (this.get('savingNewItem')) {
      afterUpdateAction = 'editNewItem';
      this.set('savingNewItem', false);
    }
    this.displayAlert('Inventory Item Saved', 'The inventory item has been saved.', afterUpdateAction);
  }
});
