import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import FulfillRequest from 'hospitalrun/mixins/fulfill-request';
import InventoryLocations from 'hospitalrun/mixins/inventory-locations'; // inventory-locations mixin is needed for fulfill-request mixin!
import InventorySelection from 'hospitalrun/mixins/inventory-selection';
import Ember from 'ember';

export default AbstractEditController.extend(FulfillRequest, InventoryLocations, InventorySelection, {
  inventoryController: Ember.inject.controller('inventory'),
  inventoryItems: null,
  cancelAction: 'allRequests',

  warehouseList: Ember.computed.alias('inventoryController.warehouseList'),
  aisleLocationList: Ember.computed.alias('inventoryController.aisleLocationList'),
  expenseAccountList: Ember.computed.alias('inventoryController.expenseAccountList'),

  inventoryList: function() {
    let inventoryItems = this.get('inventoryItems');
    if (!Ember.isEmpty(inventoryItems)) {
      let mappedItems = inventoryItems.map(function(item) {
        return item.doc;
      });
      return mappedItems;
    }
  }.property('inventoryItems.[]'),

  lookupListsToUpdate: [{
    name: 'expenseAccountList', // Name of property containing lookup list
    property: 'model.expenseAccount', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'expense_account_list' // Id of the lookup list to update
  }, {
    name: 'aisleLocationList', // Name of property containing lookup list
    property: 'model.deliveryAisle', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'aisle_location_list' // Id of the lookup list to update
  }, {
    name: 'warehouseList', // Name of property containing lookup list
    property: 'model.deliveryLocation', // Corresponding property on model that potentially contains a new value to add to the list
    id: 'warehouse_list' // Id of the lookup list to update
  }],

  canFulfill: function() {
    let requestedItems = this.get('model.requestedItems');
    return Ember.isEmpty(requestedItems) && this.currentUserCan('fulfill_inventory');
  }.property('model.requestedItems.[]'),

  isFulfilling: function() {
    let canFulfill = this.get('canFulfill');
    let isRequested = this.get('isRequested');
    let fulfillRequest = this.get('model.shouldFulfillRequest');
    let isFulfilling = (canFulfill && (isRequested || fulfillRequest));
    if (isFulfilling) {
      if (Ember.isEmpty(this.get('model.dateCompleted'))) {
        this.set('model.dateCompleted', new Date());
      }
    } else {
      this.set('model.dateCompleted');
    }
    return isFulfilling;
  }.property('isRequested', 'model.shouldFulfillRequest'),

  isRequested: function() {
    let status = this.get('model.status');
    return (status === 'Requested');
  }.property('model.status'),

  quantityLabel: function() {
    let selectedInventoryItem = this.get('selectedInventoryItem');
    if (Ember.isEmpty(selectedInventoryItem)) {
      return this.get('i18n').t('labels.quantity').toString();
    } else {
      return this.get('i18n').t('inventory.labels.quantity', { unit: selectedInventoryItem.distributionUnit }).toString();
    }
  }.property('selectedInventoryItem'),

  showRequestedItems: function() {
    let requestedItems = this.get('model.requestedItems');
    return !Ember.isEmpty(requestedItems);
  }.property('model.requestedItems.[]'),

  updateViaFulfillRequest: false,

  updateButtonText: function() {
    if (this.get('isFulfilling')) {
      return this.get('i18n').t('buttons.fulfill');
    }
    return this._super();
  }.property('model.isNew', 'isFulfilling'),

  updateCapability: 'add_inventory_request',

  actions: {
    addInventoryItem: function() {
      let model = this.get('model');
      let inventoryItem = model.get('inventoryItem');
      let requestedItems = model.get('requestedItems');
      let quantity = model.get('quantity');
      model.validate().then(function() {
        if (model.get('isValid') && !Ember.isEmpty(inventoryItem) && !Ember.isEmpty(quantity)) {
          let requestedItem = Ember.Object.create({
            item: inventoryItem.get('content'),
            quantity: quantity
          });
          requestedItems.addObject(requestedItem);
          model.set('inventoryItem');
          model.set('inventoryItemTypeAhead');
          model.set('quantity');
          this.set('selectedInventoryItem');
        }
      }.bind(this)).catch(Ember.K);
    },

    allRequests: function() {
      this.transitionToRoute('inventory.index');
    },

    removeItem: function(removeInfo) {
      let requestedItems = this.get('model.requestedItems');
      let item = removeInfo.itemToRemove;
      requestedItems.removeObject(item);
      this.send('closeModal');
    },

    showRemoveItem: function(item) {
      let message = this.get('i18n').t('inventory.messages.removeItemRequest');
      let model = Ember.Object.create({
          itemToRemove: item
        });
      let title = this.get('i18n').t('inventory.titles.removeItem');
      this.displayConfirm(title, message, 'removeItem', model);
    },

    /**
     * Update the model and perform the before update and after update
     * @param skipAfterUpdate boolean (optional) indicating whether or not
     * to skip the afterUpdate call.
     */
    update: function(skipAfterUpdate) {
      this.beforeUpdate().then(function() {
        let updateViaFulfillRequest = this.get('updateViaFulfillRequest');
        if (updateViaFulfillRequest) {
          this.updateLookupLists();
          this.performFulfillRequest(this.get('model'), false, false, true).then(this.afterUpdate.bind(this));
        } else {
          let isNew = this.get('model.isNew');
          let requestedItems = this.get('model.requestedItems');
          if (isNew && !Ember.isEmpty(requestedItems)) {
            let baseModel = this.get('model');
            let propertiesToCopy = baseModel.getProperties([
                'dateRequested',
                'deliveryAisle',
                'deliveryLocation',
                'expenseAccount',
                'requestedBy',
                'status'
              ]);
            let inventoryPromises = [];
            let newModels = [];
            let savePromises = [];
            if (!Ember.isEmpty(this.get('model.inventoryItem')) && !Ember.isEmpty(this.get('model.quantity'))) {
              savePromises.push(baseModel.save());
            }
            requestedItems.forEach(function(requestedItem) {
              propertiesToCopy.inventoryItem = requestedItem.get('item');
              propertiesToCopy.quantity = requestedItem.get('quantity');
              let modelToSave = this.get('store').createRecord('inv-request', propertiesToCopy);
              inventoryPromises.push(modelToSave.get('inventoryItem'));
              newModels.push(modelToSave);
            }.bind(this));
            Ember.RSVP.all(inventoryPromises, 'Get inventory items for inventory requests').then(function() {
              newModels.forEach(function(newModel) {
                savePromises.push(newModel.save());
              });
              Ember.RSVP.all(savePromises, 'Save batch inventory requests').then(function() {
                this.updateLookupLists();
                this.afterUpdate();
              }.bind(this));
            }.bind(this));
          } else {
            this.get('model').save().then(function(record) {
              this.updateLookupLists();
              if (!skipAfterUpdate) {
                this.afterUpdate(record);
              }
            }.bind(this));
          }
        }
      }.bind(this));
    }
  },

  afterUpdate: function() {
    let updateViaFulfillRequest = this.get('updateViaFulfillRequest');
    if (updateViaFulfillRequest) {
      this.displayAlert(this.get('i18n').t('inventory.titles.requestFulfilled'), this.get('i18n').t('inventory.messages.requestFulfilled'), 'allRequests');
    } else {
      this.displayAlert(this.get('i18n').t('inventory.titles.requestUpdated'), this.get('i18n').t('inventory.messages.requestUpdated'));
    }
  },

  beforeUpdate: function() {
    if (this.get('isFulfilling')) {
      this.set('updateViaFulfillRequest', true);
    } else {
      this.set('updateViaFulfillRequest', false);
    }
    if (this.get('model.isNew')) {
      this.set('model.dateRequested', new Date());
      this.set('model.requestedBy', this.get('model').getUserName());
      if (!this.get('isFulfilling')) {
        this.set('model.status', 'Requested');
      }
    }
    return Ember.RSVP.resolve();
  }
});
