import InventoryTypeList from 'hospitalrun/mixins/inventory-type-list';    
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend(InventoryTypeList, {
    actions: {
        deleteBatch: function(batch, expire) {
            var batches = this.get('batches'),
                quantity = batch.get('currentQuantity');
            batches.removeObject(batch);
            if (expire) {                    
                //On expire add the object again to move it to the expired list
                batches.addObject(batch);
            }
            this.decrementProperty('quantity', quantity);    
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
            if (updateQuantity !== 0) {
                this.incrementProperty('quantity', updateQuantity);
                this.send('update',true);
            }
            this.send('closeModal');            
        },
    },
    
    afterUpdate: function(record) {
        this.transitionToRoute('/inventory/search/'+record.get('id'));
    }
});
