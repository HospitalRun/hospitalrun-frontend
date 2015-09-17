import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import FulfillRequest from 'hospitalrun/mixins/fulfill-request'; 
import InventoryLocations from 'hospitalrun/mixins/inventory-locations'; //inventory-locations mixin is needed for fulfill-request mixin!
import InventorySelection from 'hospitalrun/mixins/inventory-selection';
import Ember from 'ember';

export default AbstractEditController.extend(FulfillRequest, InventoryLocations, InventorySelection, {    
    needs: ['inventory'],    
    cancelAction: 'allRequests',
   
    warehouseList: Ember.computed.alias('controllers.inventory.warehouseList'),
    aisleLocationList: Ember.computed.alias('controllers.inventory.aisleLocationList'),
    expenseAccountList: Ember.computed.alias('controllers.inventory.expenseAccountList'),
    
    inventoryList: function() {
        var inventoryItems = this.get('inventoryItems');
        if (!Ember.isEmpty(inventoryItems)) {
            var mappedItems = inventoryItems.map(function(item) {
                return item.doc;
            });
            return mappedItems;
        }
    }.property('inventoryItems.[]'),
    
    lookupListsToUpdate: [{
        name: 'expenseAccountList', //Name of property containing lookup list
        property: 'expenseAccount', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'expense_account_list' //Id of the lookup list to update
     },{
        name: 'aisleLocationList', //Name of property containing lookup list
        property: 'deliveryAisle', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'aisle_location_list' //Id of the lookup list to update
    }, {
        name: 'warehouseList', //Name of property containing lookup list
        property: 'deliveryLocation', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'warehouse_list' //Id of the lookup list to update
    }],

    canFulfill: function() {
        var requestedItems = this.get('requestedItems');
        return Ember.isEmpty(requestedItems) && this.currentUserCan('fulfill_inventory');
    }.property('requestedItems.@each'),

    isFulfilling: function() {
        var canFulfill = this.get('canFulfill'),
            isRequested = this.get('isRequested'),
            fulfillRequest = this.get('shouldFulfillRequest');
        return (canFulfill && (isRequested || fulfillRequest));
    }.property('isRequested', 'shouldFulfillRequest'),

    isRequested: function() {
        var status = this.get('status');
        return (status === 'Requested');
    }.property('status'),
    
    quantityLabel: function() {
        var selectedInventoryItem = this.get('selectedInventoryItem');
        if (Ember.isEmpty(selectedInventoryItem)) {
            return 'Quantity';
        } else {
            return 'Quantity (%@)'.fmt(selectedInventoryItem.distributionUnit);
        }
    }.property('selectedInventoryItem'),
    
    showRequestedItems: function() {
        var requestedItems = this.get('requestedItems');
        return !Ember.isEmpty(requestedItems);
    }.property('requestedItems.@each'),
    
    updateViaFulfillRequest: false,

    updateButtonText: function() {
        if (this.get('isFulfilling')) {
            return 'Fulfill';
        } else if (this.get('isNew')) {
            return 'Add';
        } else {
            return 'Update';
        }
    }.property('isNew', 'isFulfilling'),
    
    updateCapability: 'add_inventory_request',
    
    actions: {
        addInventoryItem: function() {
            var inventoryItem = this.get('inventoryItem'),
                model = this.get('model'),
                requestedItems = this.get('requestedItems'),
                quantity = this.get('quantity');
            model.validate();
            if (this.get('isValid') && !Ember.isEmpty(inventoryItem) && !Ember.isEmpty(quantity)) {
                var requestedItem = Ember.Object.create({
                    item: inventoryItem.get('content'),
                    quantity: quantity
                });
                requestedItems.addObject(requestedItem);
                this.set('inventoryItem');
                this.set('inventoryItemTypeAhead');
                this.set('quantity');
                this.set('selectedInventoryItem');
            }
        },
        
        allRequests: function() {
            this.transitionToRoute('inventory.index');
        },
        
        removeItem: function(removeInfo) {
            var requestedItems = this.get('requestedItems'),
                item = removeInfo.itemToRemove;
            requestedItems.removeObject(item);
            this.send('closeModal');
        },        
        
        showRemoveItem: function(item) {
           var message= 'Are you sure you want to remove this item from this request?',
                model = Ember.Object.create({
                    itemToRemove: item               
                }),
                title = 'Remove Payment';
            this.displayConfirm(title, message, 'removeItem', model);            
        },
        
        /**
         * Update the model and perform the before update and after update
         * @param skipAfterUpdate boolean (optional) indicating whether or not 
         * to skip the afterUpdate call.
         */
        update: function(skipAfterUpdate) {
            this.beforeUpdate().then(function() {
                var updateViaFulfillRequest = this.get('updateViaFulfillRequest');
                if (updateViaFulfillRequest) {
                    this.updateLookupLists();
                    this.performFulfillRequest(this.get('model'), false, false, true).then(this.afterUpdate.bind(this));
                } else {
                    var isNew = this.get('isNew'),
                        requestedItems = this.get('requestedItems');
                    if (isNew && !Ember.isEmpty(requestedItems)) {
                        var baseModel = this.get('model'),
                            propertiesToCopy = baseModel.getProperties([
                                'dateRequested',
                                'deliveryAisle', 
                                'deliveryLocation', 
                                'expenseAccount',
                                'requestedBy',
                                'status'
                            ]),
                            inventoryPromises = [],
                            newModels = [],
                            savePromises = [];
                        if (!Ember.isEmpty(this.get('inventoryItem')) && !Ember.isEmpty(this.get('quantity'))) {
                            savePromises.push(baseModel.save());
                        }
                        requestedItems.forEach(function(requestedItem) {     
                            propertiesToCopy.inventoryItem = requestedItem.get('item');
                            propertiesToCopy.quantity = requestedItem.get('quantity');
                            var modelToSave = this.get('store').createRecord('inv-request', propertiesToCopy);
                            inventoryPromises.push(modelToSave.get('inventoryItem'));
                            newModels.push(modelToSave);
                        }.bind(this));
                        Ember.RSVP.all(inventoryPromises,'Get inventory items for inventory requests').then(function(){
                            newModels.forEach(function(newModel) {
                                savePromises.push(newModel.save());
                            });
                            Ember.RSVP.all(savePromises,'Save batch inventory requests').then(function(){
                                this.updateLookupLists();                            
                                this.afterUpdate();                            
                            }.bind(this));
                        }.bind(this));
                    } else {
                        this.get('model').save().then(function(record){
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
        var updateViaFulfillRequest = this.get('updateViaFulfillRequest');
        if (updateViaFulfillRequest) {
            this.displayAlert('Request Fulfilled', 'The inventory request has been fulfilled.', 'allRequests');
        } else {
            this.displayAlert('Request Updated', 'The inventory request has been updated.');
        }
    }, 

    beforeUpdate: function() {
        if (this.get('isFulfilling')) {
            this.set('dateCompleted', new Date());
            this.set('updateViaFulfillRequest', true);
        } else {
            this.set('updateViaFulfillRequest', false);
        }
        if (this.get('isNew')) {
            this.set('dateRequested', new Date());
            this.set('requestedBy', this.get('model').getUserName());
            if (!this.get('isFulfilling')) {
                this.set('status', 'Requested');
            }
        }
        return Ember.RSVP.resolve();        
    }
});