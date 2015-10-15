import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import InventoryLocations from 'hospitalrun/mixins/inventory-locations';
import InventoryTypeList from 'hospitalrun/mixins/inventory-type-list';
import ReturnTo from 'hospitalrun/mixins/return-to';
import UnitTypes from 'hospitalrun/mixins/unit-types';
import UserSession from 'hospitalrun/mixins/user-session';

export default AbstractEditController.extend(InventoryLocations, InventoryTypeList, ReturnTo, UnitTypes, UserSession, {
  inventory: Ember.inject.controller(),

  canAddPurchase: function() {
    return this.currentUserCan('add_inventory_purchase');
  }.property(),

  canAdjustLocation: function() {
    return this.currentUserCan('adjust_inventory_location');
  },

  canDeletePurchase: function() {
    return this.currentUserCan('delete_inventory_purchase');
  }.property(),

  warehouseList: Ember.computed.alias('inventory.warehouseList'),
  aisleLocationList: Ember.computed.alias('inventory.aisleLocationList'),
  inventoryTypeList: Ember.computed.alias('inventory.inventoryTypeList.value'),
  vendorList: Ember.computed.alias('inventory.vendorList'),
  database: Ember.inject.service(),

  lookupListsToUpdate: [{
    name: 'aisleLocationList', // Name of property containing lookup list
    property: 'aisleLocation', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'aisle_location_list' // Id of the lookup list to update
  }, {
    name: 'vendorList', // Name of property containing lookup list
    property: 'vendor', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'vendor_list' // Id of the lookup list to update
  }, {
    name: 'warehouseList', // Name of property containing lookup list
    property: 'location', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'warehouse_list' // Id of the lookup list to update
  }],

  canEditQuantity: function() {
    return (this.get('model.isNew'));
  }.property('model.isNew'),

  haveTransactions: function() {
    var transactions = this.get('transactions');
    return transactions !== null;
  }.property('transactions.[]'),

  locationQuantityTotal: function() {
    var locations = this.get('locations');
    var total = locations.reduce(function(previousValue, location) {
      return previousValue + parseInt(location.get('quantity'));
    }, 0);
    return total;
  }.property('locations'),

  /**
   * Check to see if the total quantity by location matches the quantity calculated on the item
   * @return {boolean} true if there is a discrepency;otherwise false.
   */
  quantityDiscrepency: function() {
    var locationQuantityTotal = this.get('locationQuantityTotal'),
      quantity = this.get('quantity');
    return (!Ember.isEmpty(locationQuantityTotal) && !Ember.isEmpty(quantity) && locationQuantityTotal !== quantity);
  }.property('locationQuantityTotal', 'quantity'),

  /**
   * Get the difference in quantity between the total quantity by location and the quantity on the item.
   * @return {int} the difference.
   */
  quantityDifferential: function() {
    var locationQuantityTotal = this.get('locationQuantityTotal'),
      quantity = this.get('quantity');
    return Math.abs(locationQuantityTotal - quantity);
  }.property('locationQuantityTotal', 'quantity'),

  originalQuantityUpdated: function() {
    var isNew = this.get('model.isNew'),
      quantity = this.get('model.originalQuantity');
    if (isNew && !Ember.isEmpty(quantity)) {
      this.set('quantity', quantity);
    }
  }.observes('model.isNew', 'model.originalQuantity'),

  showTransactions: function() {
    var transactions = this.get('transactions');
    return !Ember.isEmpty(transactions);
  }.property('transactions.[]'),

  transactions: null,

  updateCapability: 'add_inventory_item',

  actions: {
    adjustItems: function(inventoryLocation) {
      var adjustmentQuantity = parseInt(inventoryLocation.get('adjustmentQuantity')),
        inventoryItem = this.get('model'),
        transactionType = inventoryLocation.get('transactionType'),
        request = this.get('store').createRecord('inv-request', {
          adjustPurchases: true,
          dateCompleted: inventoryLocation.get('dateCompleted'),
          expenseAccount: inventoryLocation.get('expenseAccount'),
          inventoryItem: inventoryItem,
          quantity: adjustmentQuantity,
          transactionType: transactionType,
          reason: inventoryLocation.get('reason'),
          deliveryAisle: inventoryLocation.get('aisleLocation'),
          deliveryLocation: inventoryLocation.get('location')
        });
      request.set('inventoryLocations', [inventoryLocation]);
      var increment = false;
      if (transactionType === 'Adjustment (Add)' || transactionType === 'Return') {
        increment = true;
      }
      request.set('markAsConsumed', true);
      // Make sure inventory item is resolved first.
      request.get('inventoryItem').then(function() {
        this.send('fulfillRequest', request, true, increment, true);
      }.bind(this));
    },

    deletePurchase: function(purchase, deleteFromLocation, expire) {
      var purchases = this.get('purchases'),
        quantityDeleted = purchase.get('currentQuantity');
      if (expire) {
        purchase.set('expired', true);
        purchase.save();
      } else {
        purchases.removeObject(purchase);
        purchase.destroyRecord();
      }
      if (!Ember.isEmpty(deleteFromLocation)) {
        deleteFromLocation.decrementProperty('quantity', quantityDeleted);
        deleteFromLocation.save();
      }
      this.get('model').updateQuantity();
      this.send('update', true);
      this.send('closeModal');
    },

    editNewItem: function() {
      this.send('editItem', this.get('id'));
    },

    showAdjustment: function(inventoryLocation) {
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

    showDeletePurchase: function(purchase) {
      this.send('openModal', 'inventory.purchase.delete', purchase);
    },

    showEditPurchase: function(purchase) {
      this.send('openModal', 'inventory.purchase.edit', purchase);
    },

    showExpirePurchase: function(purchase) {
      purchase.set('expire', true);
      this.send('openModal', 'inventory.purchase.delete', purchase);
    },

    showTransfer: function(inventoryLocation) {
      inventoryLocation.set('adjustmentQuantity');
      inventoryLocation.set('transferItem', this.get('model'));
      inventoryLocation.set('dateCompleted', new Date());
      this.send('openModal', 'inventory.transfer', inventoryLocation);
    },

    transferItems: function(inventoryLocation) {
      var inventoryItem = this.get('model'),
        request = this.get('store').createRecord('inv-request', {
          adjustPurchases: false,
          dateCompleted: inventoryLocation.get('dateCompleted'),
          inventoryItem: inventoryItem,
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

    updatePurchase: function(purchase, updateQuantity) {
      if (updateQuantity) {
        this.get('model').updateQuantity();
        this.send('update', true);
      }
      this.send('closeModal');
    }
  },

  _completeBeforeUpdate: function(sequence, resolve, reject) {
    var sequenceValue = null,
      friendlyId = sequence.get('prefix'),
      promises = [],
      newPurchase = this.getProperties('aisleLocation', 'dateReceived',
        'purchaseCost', 'lotNumber', 'expirationDate', 'giftInKind',
        'location', 'vendor', 'vendorItemNo'),
      quantity = this.get('quantity');
    if (!Ember.isEmpty(quantity)) {
      newPurchase.originalQuantity = quantity;
      newPurchase.currentQuantity = quantity;
      newPurchase.inventoryItem = this.get('model.id');
      var purchase = this.get('store').createRecord('inv-purchase', newPurchase);
      promises.push(purchase.save());
      this.get('purchases').addObject(purchase);
      promises.push(this.newPurchaseAdded(this.get('model'), purchase));
    }
    sequence.incrementProperty('value', 1);
    sequenceValue = sequence.get('value');
    if (sequenceValue < 100000) {
      friendlyId += String('00000' + sequenceValue).slice(-5);
    } else {
      friendlyId += sequenceValue;
    }
    this.set('friendlyId', friendlyId);
    promises.push(sequence.save());
    Ember.RSVP.all(promises, 'All before update done for inventory item').then(function() {
      resolve();
    }, function(error) {
      reject(error);
    });
  },

  _findSequence: function(inventoryType, resolve, reject) {
    var sequenceFinder = new Ember.RSVP.Promise(function(resolve) {
      this._checkNextSequence(resolve, inventoryType, 0);
    }.bind(this));
    sequenceFinder.then(function(prefixChars) {
      var newSequence = this.get('store').push('sequence', {
        id: 'inventory_' + inventoryType,
        prefix: inventoryType.toLowerCase().substr(0, prefixChars),
        value: 0
      });
      this._completeBeforeUpdate(newSequence, resolve, reject);
    }.bind(this));
  },

  _findSequenceByPrefix: function(inventoryType, prefixChars) {
    var database = this.get('database');
    var sequenceQuery = {
      key: inventoryType.toLowerCase().substr(0, prefixChars)
    };
    return database.queryMainDB(sequenceQuery, 'sequence_by_prefix');
  },

  _checkNextSequence: function(resolve, inventoryType, prefixChars) {
    prefixChars++;
    this._findSequenceByPrefix(inventoryType, prefixChars).then(function(records) {
      if (Ember.isEmpty(records.rows)) {
        resolve(prefixChars);
      } else {
        this._checkNextSequence(resolve, inventoryType, prefixChars);
      }
    }.bind(this), function() {
      resolve(prefixChars);
    });
  },

  /**
   * Saves the specified request, then updates the inventory item and closes the modal.
   */
  _saveRequest: function(request) {
    request.set('status', 'Completed');
    request.set('completedBy', request.getUserName());
    request.save().then(function() {
      this.send('update', true);
      this.send('closeModal');
      this.getTransactions();
    }.bind(this));
  },

  getTransactions: function() {
    var inventoryId = this.get('id');
    this.set('transactions', null);
    this.store.find('inv-request', {
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

  beforeUpdate: function() {
    if (this.get('isNew')) {
      var model = this.get('model'),
        inventoryType = model.get('inventoryType');
      return new Ember.RSVP.Promise(function(resolve, reject) {
        model.validate().then(function() {
          if (model.get('isValid')) {
            this.set('savingNewItem', true);
            this.store.find('sequence', 'inventory_' + inventoryType).then(function(sequence) {
              this._completeBeforeUpdate(sequence, resolve, reject);
            }.bind(this), function() {
              this._findSequence(inventoryType, resolve, reject);
            }.bind(this));
          } else {
            this.send('showDisabledDialog');
            reject('invalid model');
          }
        }.bind(this)).catch(function() {
          this.send('showDisabledDialog');
        }.bind(this));
      }.bind(this));
    } else {
      return Ember.RSVP.Promise.resolve();
    }
  },

  afterUpdate: function() {
    var afterUpdateAction = null;
    if (this.get('savingNewItem')) {
      afterUpdateAction = 'editNewItem';
      this.set('savingNewItem', false);
    }
    this.displayAlert('Inventory Item Saved', 'The inventory item has been saved.', afterUpdateAction);
  }
});
