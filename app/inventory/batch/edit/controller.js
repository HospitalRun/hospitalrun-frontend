import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend({    
    canEditQuantity: function() {
        var originalQuantity = this.get('originalQuantity'),
            currentQuantity = this.get('currentQuantity');
        if (currentQuantity < originalQuantity) {
            return false;
        }
        return true;
    }.property('currentQuantity'),
    
    newBatch: false,
    
    updateQuantity: false,

    title: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add Batch';
        }
        return 'Edit Batch';
	}.property('isNew'),
    
    actions: {
        cancel: function() {
            var cancelledItem = this.get('model');
            if (this.get('isNew')) {
                cancelledItem.deleteRecord();
            } else {
                cancelledItem.rollback();
            }
            this.send('closeModal');
        },
    },
    
    beforeUpdate: function() {
        var isNew = this.get('isNew'),
             changedAttributes = this.get('model').changedAttributes();
        if (changedAttributes.originalQuantity) {
            this.set('currentQuantity',this.get('originalQuantity'));
            if (!isNew) {
                this.set('updateQuantity', true);                
            }
        }
        if (isNew) {
            this.set('newBatch', true);
            this.set('dateAdded', new Date());            
        }        
    },
    
    afterUpdate: function(record) {
        if (this.get('newBatch')) {            
            this.send('addBatch', record);
        } else {
            this.send('updateBatch', record, true);
        }
    }
});
