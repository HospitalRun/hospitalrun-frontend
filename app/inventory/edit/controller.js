import InventoryTypeList from 'hospitalrun/mixins/inventory-type-list';
import UnitTypes from "hospitalrun/mixins/unit-types";
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend(InventoryTypeList, UnitTypes, {
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
        return (this.get('isNew') || !this.get('showBatches'));
    }.property('isNew', 'showBatches'),

    showNewBatch: function() {
        return (this.get('isNew') && this.get('showBatches'));
    }.property('isNew', 'showBatches'),
    
    showBatches: function() {
        return (this.get('type') !== 'Asset');
    }.property('type'),
    
    originalQuantityUpdated: function() {
        var quantity = this.get('originalQuantity');
        this.set('quantity', quantity);
    }.observes('originalQuantity'),
    
    actions: {
        deleteBatch: function(batch, expire) {
            var batches = this.get('batches');
            if (expire) {
                batch.set('expired', true);
                batch.save();
            } else {
                batches.removeObject(batch);
                batch.destroyRecord();
            }
            this.get('model').updateQuantity();
            this.send('update',true);
            this.send('closeModal');        
        },

        showDeleteBatch: function(batch) {
            this.send('openModal', 'inventory.batch.delete', batch);
        },
        
        showEditBatch: function(batch) {
            this.send('openModal', 'inventory.batch.edit', batch);
        },
        
        showExpireBatch: function(batch) {
            batch.set('expire', true);
            this.send('openModal', 'inventory.batch.delete', batch);
        },
        
        updateBatch: function(batch, updateQuantity) {
            if (updateQuantity) {
                this.get('model').updateQuantity();
                this.send('update',true);
            }
            this.send('closeModal');            
        },
    },
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            var newBatch = this.getProperties('aisleLocation', 'batchCost', 
                'batchNo', 'expirationDate', 'giftInKind', 'location', 'vendor',
                'vendorItemNo');
            newBatch.dateAdded = new Date();
            newBatch.originalQuantity = this.get('quantity');
            newBatch.currentQuantity = newBatch.originalQuantity;
            var batch = this.get('store').createRecord('inv-batch', newBatch);
            batch.save();
            this.get('batches').addObject(batch);
        }        
    },

    
    afterUpdate: function(record) {
        this.transitionToRoute('/inventory/search/'+record.get('id'));
    }
});
