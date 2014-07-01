import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
export default AbstractEditRoute.extend({
    editTitle: 'Edit Item',    
    newTitle: 'New Item',
    
    actions: {        
        deleteBatch: function(batch) {
            this.controller.send('deleteBatch', batch);
        },
        
        expireBatch: function(batch) {
            this.controller.send('deleteBatch', batch, true);
        },
        
        updateBatch: function(batch, updateQuantity) {
            this.controller.send('updateBatch', batch, updateQuantity);
        }
    }
});