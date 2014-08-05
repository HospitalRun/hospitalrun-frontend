import InventoryTypeList from 'hospitalrun/mixins/inventory-type-list';
import UnitTypes from "hospitalrun/mixins/unit-types";
import UpdateInventoryLocations from "hospitalrun/mixins/update-inventory-locations";
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend(InventoryTypeList, UnitTypes, UpdateInventoryLocations, {
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
        deletePurchase: function(purchase, expire) {
            var purchases = this.get('purchases');
            if (expire) {
                purchase.set('expired', true);
                purchase.save();
            } else {
                purchases.removeObject(purchase);
                purchase.destroyRecord();
            }
            this.get('model').updateQuantity();
            this.send('update',true);
            this.send('closeModal');        
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
            this.send('openModal', 'inventory.transfer', inventoryLocation);
        },
        
        transferItems: function(inventoryLocation) {
            var inventoryItem = this.get('model');
            this.transferToLocation(inventoryItem, inventoryLocation);
            this.send('update',true);
            this.send('closeModal');
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
