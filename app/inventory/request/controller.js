import { all, resolve } from 'rsvp';
import EmberObject, { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import { alias } from '@ember/object/computed';
import { inject as controller } from '@ember/controller';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import FulfillRequest from 'hospitalrun/mixins/fulfill-request';
import InventoryLocations from 'hospitalrun/mixins/inventory-locations'; // inventory-locations mixin is needed for fulfill-request mixin!

export default AbstractEditController.extend(FulfillRequest, InventoryLocations, {
  inventoryController: controller('inventory'),
  inventoryItems: null,
  cancelAction: 'allRequests',

  warehouseList: alias('inventoryController.warehouseList'),
  aisleLocationList: alias('inventoryController.aisleLocationList'),
  expenseAccountList: alias('inventoryController.expenseAccountList'),

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

  canFulfill: computed('model.requestedItems.[]', function() {
    let requestedItems = this.get('model.requestedItems');
    return isEmpty(requestedItems) && this.currentUserCan('fulfill_inventory');
  }),

  isFulfilling: computed('isRequested', 'model.shouldFulfillRequest', function() {
    let canFulfill = this.get('canFulfill');
    let isRequested = this.get('isRequested');
    let fulfillRequest = this.get('model.shouldFulfillRequest');
    let isFulfilling = (canFulfill && (isRequested || fulfillRequest));
    if (isFulfilling) {
      if (isEmpty(this.get('model.dateCompleted'))) {
        this.set('model.dateCompleted', new Date());
      }
    } else {
      this.set('model.dateCompleted');
    }
    return isFulfilling;
  }),

  isRequested: computed('model.status', function() {
    let status = this.get('model.status');
    return (status === 'Requested');
  }),

  quantityLabel: computed('selectedInventoryItem', function() {
    let selectedInventoryItem = this.get('selectedInventoryItem');
    if (isEmpty(selectedInventoryItem)) {
      return this.get('intl').t('labels.quantity').toString();
    } else {
      return this.get('intl').t('inventory.labels.quantity', { unit: selectedInventoryItem.distributionUnit }).toString();
    }
  }),

  showRequestedItems: computed('model.requestedItems.[]', function() {
    let requestedItems = this.get('model.requestedItems');
    return !isEmpty(requestedItems);
  }),

  updateViaFulfillRequest: false,

  updateButtonText: computed('model.isNew', 'isFulfilling', function() {
    if (this.get('isFulfilling')) {
      return this.get('intl').t('buttons.fulfill');
    }
    return this._super();
  }),

  updateCapability: 'add_inventory_request',

  actions: {
    addInventoryItem() {
      let model = this.get('model');
      let inventoryItem = model.get('inventoryItem');
      let requestedItems = model.get('requestedItems');
      let quantity = model.get('quantity');
      model.validate().then(function() {
        if (model.get('isValid') && !isEmpty(inventoryItem) && !isEmpty(quantity)) {
          let requestedItem = EmberObject.create({
            item: inventoryItem.get('content'),
            quantity
          });
          requestedItems.addObject(requestedItem);
          model.set('inventoryItem');
          model.set('inventoryItemTypeAhead');
          model.set('quantity');
          this.set('selectedInventoryItem');
        }
      }.bind(this)).catch(function() {});
    },

    allRequests() {
      this.transitionToRoute('inventory.index');
    },

    removeItem(removeInfo) {
      let requestedItems = this.get('model.requestedItems');
      let item = removeInfo.itemToRemove;
      requestedItems.removeObject(item);
      this.send('closeModal');
    },

    showRemoveItem(item) {
      let message = this.get('intl').t('inventory.messages.removeItemRequest');
      let model = EmberObject.create({
        itemToRemove: item
      });
      let title = this.get('intl').t('inventory.titles.removeItem');
      this.displayConfirm(title, message, 'removeItem', model);
    },

    /**
     * Update the model and perform the before update and after update
     * @param skipAfterUpdate boolean (optional) indicating whether or not
     * to skip the afterUpdate call.
     */
    update(skipAfterUpdate) {
      this.beforeUpdate().then(function() {
        let updateViaFulfillRequest = this.get('updateViaFulfillRequest');
        if (updateViaFulfillRequest) {
          this.updateLookupLists();
          this.performFulfillRequest(this.get('model'), false, false, true).then(this.afterUpdate.bind(this));
        } else {
          let isNew = this.get('model.isNew');
          let requestedItems = this.get('model.requestedItems');
          if (isNew && !isEmpty(requestedItems)) {
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
            if (!isEmpty(this.get('model.inventoryItem')) && !isEmpty(this.get('model.quantity'))) {
              savePromises.push(baseModel.save());
            }
            requestedItems.forEach(function(requestedItem) {
              propertiesToCopy.inventoryItem = requestedItem.get('item');
              propertiesToCopy.quantity = requestedItem.get('quantity');
              let modelToSave = this.get('store').createRecord('inv-request', propertiesToCopy);
              inventoryPromises.push(modelToSave.get('inventoryItem'));
              newModels.push(modelToSave);
            }.bind(this));
            all(inventoryPromises, 'Get inventory items for inventory requests').then(function() {
              newModels.forEach(function(newModel) {
                savePromises.push(newModel.save());
              });
              all(savePromises, 'Save batch inventory requests').then(function() {
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

  afterUpdate() {
    let updateViaFulfillRequest = this.get('updateViaFulfillRequest');
    if (updateViaFulfillRequest) {
      this.displayAlert(this.get('intl').t('inventory.titles.requestFulfilled'), this.get('intl').t('inventory.messages.requestFulfilled'), 'allRequests');
    } else {
      this.displayAlert(this.get('intl').t('inventory.titles.requestUpdated'), this.get('intl').t('inventory.messages.requestUpdated'));
    }
  },

  beforeUpdate() {
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
    return resolve();
  }
});
