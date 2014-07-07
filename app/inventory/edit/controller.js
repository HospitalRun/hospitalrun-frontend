import InventoryTypeList from 'hospitalrun/mixins/inventory-type-list';    
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend(InventoryTypeList, {
    canEditQuantity: function() {
        return (this.get('isNew') || !this.get('showBatches'));
    }.property('isNew', 'showBatches'),

    showNewBatch: function() {
        return (this.get('isNew') && this.get('showBatches'));
    }.property('isNew', 'showBatches'),
    
    showBatches: function() {
        return (this.get('type') !== 'Asset');
    }.property('type'),
    
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
            var newBatch = this.getProperties('batchCost', 'batchNo', 'expirationDate', 'vendor');
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
