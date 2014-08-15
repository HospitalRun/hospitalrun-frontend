import InventoryTypeList from 'hospitalrun/mixins/inventory-type-list';
import UnitTypes from "hospitalrun/mixins/unit-types";
import InventoryLocations from "hospitalrun/mixins/inventory-locations";
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend(InventoryLocations, InventoryTypeList, UnitTypes, {
    needs: 'inventory',
    
    warehouseList: Ember.computed.alias('controllers.inventory.warehouseList'),
    aisleLocationList: Ember.computed.alias('controllers.inventory.aisleLocationList'),
    
    lookupListsToUpdate: [{
        name: 'aisleLocationList', //Name of property containing lookup list
        property: 'aisleLocation', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'aisle_location_list' //Id of the lookup list to update
    }, {
        name: 'warehouseList', //Name of property containing lookup list
        property: 'location', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'warehouse_list' //Id of the lookup list to update
    }],
    
    canEditQuantity: function() {
        return (this.get('isNew') || !this.get('showPurchases'));
    }.property('isNew', 'showPurchases'),
    
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
        return (locationQuantityTotal !== quantity);
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

    showNewPurchase: function() {
        return (this.get('isNew') && this.get('showPurchases'));
    }.property('isNew', 'showPurchases'),
    
    showPurchases: function() {
        return (this.get('type') !== 'Asset');
    }.property('type'),
    
    showLocations: function() {
        return (!this.get('isNew') && this.get('type') !== 'Asset');
    }.property('isNew', 'type'),    
    
    originalQuantityUpdated: function() {
        var isNew = this.get('isNew'),
            quantity = this.get('originalQuantity');
        if (isNew && !Ember.isEmpty(quantity)) {
            this.set('quantity', quantity);
        }
    }.observes('originalQuantity'),

    actions: {
        adjustItems: function(inventoryLocation) {
            var adjustPurchases = inventoryLocation.get('adjustPurchases'),
                adjustmentQuantity = parseInt(inventoryLocation.get('adjustmentQuantity')),
                inventoryItem = this.get('model'),                
                transactionType = inventoryLocation.get('transactionType'),
                request = this.get('store').createRecord('inv-request', {
                    dateCompleted: inventoryLocation.get('dateCompleted'),
                    inventoryItem: inventoryItem,
                    quantity: adjustmentQuantity,
                    transactionType: transactionType,
                    reason: inventoryLocation.get('reason'),
                    deliveryAisle: inventoryLocation.get('aisleLocation'),
                    deliveryLocation: inventoryLocation.get('location')
                });
            request.get('inventoryLocations').then(function(inventoryLocations) {
                inventoryLocations.addObject(inventoryLocation);
                if (adjustPurchases) {
                    var increment = false;
                    if (transactionType === 'Adjustment (Add)') {
                        increment = true;
                    }
                    request.set('markAsConsumed',true);
                    //Make sure inventory item is resolved first.
                    request.get('inventoryItem').then(function() {
                        this.send('fulfillRequest', request, true, increment, true);
                    }.bind(this));
                } else {
                    this.adjustLocation(inventoryItem, inventoryLocation);
                    this._saveRequest(request);
                }
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
                this.saveLocation(deleteFromLocation, this.get('model'));
            }
            this.get('model').updateQuantity();
            this.send('update',true);
            this.send('closeModal');        
        },
        
        showAdjustment: function(inventoryLocation) {
            inventoryLocation.set('dateCompleted', new Date());
            inventoryLocation.set('adjustmentItem', this.get('model'));
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
            inventoryLocation.set('transferItem', this.get('model'));
            inventoryLocation.set('dateCompleted', new Date());
            this.send('openModal', 'inventory.transfer', inventoryLocation);
        },
        
        transferItems: function(inventoryLocation) {
            var inventoryItem = this.get('model'),
                request = this.get('store').createRecord('inv-request', {
                    dateCompleted: inventoryLocation.get('dateCompleted'),
                    inventoryItem: inventoryItem,
                    quantity: inventoryLocation.get('adjustmentQuantity'),
                    deliveryAisle: inventoryLocation.get('transferAisleLocation'),
                    deliveryLocation: inventoryLocation.get('transferLocation'),
                    transactionType: 'Transfer'
                });
            this.transferToLocation(inventoryItem, inventoryLocation);            
            inventoryLocation.setProperties({
                transferItem: null,
                transferLocation: null,
                transferAisleLocation: null,
                adjustmentQuantity: null
            });
            request.get('inventoryLocations').then(function(inventoryLocations) {
                inventoryLocations.addObject(inventoryLocation);
                this._saveRequest(request);
            }.bind(this));
        },
        
        updatePurchase: function(purchase, updateQuantity) {
            if (updateQuantity) {
                this.get('model').updateQuantity();
                this.send('update',true);
            }
            this.send('closeModal');            
        },
    },
    
    _completeBeforeUpdate: function(sequence, resolve, reject) {
        var sequenceValue = null,
            friendlyId = sequence.get('prefix'),
            promises = [];
        
        if (this.get('showPurchases')) {
            var newPurchase = this.getProperties('aisleLocation', 'purchaseCost', 
                'lotNumber', 'expirationDate', 'giftInKind', 'location', 'vendor',
                'vendorItemNo');
            newPurchase.dateAdded = new Date();
            newPurchase.originalQuantity = this.get('quantity');
            newPurchase.currentQuantity = newPurchase.originalQuantity;
            var purchase = this.get('store').createRecord('inv-purchase', newPurchase);
            promises.push(purchase.save());
            this.get('purchases').addObject(purchase);
            this.newPurchaseAdded(this.get('model'), purchase);
        }
        sequence.incrementProperty('value',1);
        sequenceValue = sequence.get('value');
        if (sequenceValue < 100000) {
            friendlyId += String('00000' + sequenceValue).slice(-5);
        } else {
            friendlyId += sequenceValue;
        }
        this.set('friendlyId', friendlyId);
        promises.push(sequence.save());
        Ember.RSVP.all(promises,'All before update done for inventory item').then(function(){
            resolve();
        }, function(error) {
            reject(error);
        });
    },
    
    /**
     * Saves the specified request, then updates the inventory item and closes the modal.
     */
    _saveRequest: function(request) {
        request.set('status', 'Completed');
        request.set('completedBy',request.getUserName());
        request.save().then(function() {
            this.send('update',true);
            this.send('closeModal');                    
        }.bind(this));
    },
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            var type = this.get('type');
            return new Ember.RSVP.Promise(function(resolve, reject){
                this.store.find('sequence', 'inventory_'+type).then(function(sequence) {
                    this._completeBeforeUpdate(sequence, resolve, reject);
                }.bind(this), function() {
                    var newSequence = this.get('store').push('sequence',{
                        id: 'inventory_'+type,
                        prefix: type.toLowerCase().substr(0,1),
                        value: 0
                    });
                    this._completeBeforeUpdate(newSequence, resolve, reject);
                }.bind(this));
            }.bind(this));
        } else {
            return Ember.RSVP.Promise.resolve();
        }
    },
    
    afterUpdate: function(record) {
        this.transitionToRoute('/inventory/search/'+record.get('id'));
    }
});
