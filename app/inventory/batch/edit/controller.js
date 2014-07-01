import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    

export default AbstractEditController.extend({
        
    calculatedCostPerUnit: function() {
        var batchCost = this.get('batchCost'),
            quantity = parseInt(this.get('originalQuantity'));
        if (Ember.isEmpty(batchCost) || Ember.isEmpty(quantity)) {
            return 0;
        }
        return (batchCost/quantity).toFixed(2);
    }.property('batchCost', 'originalQuantity'),
    
    canEditQuantity: function() {
        var originalQuantity = this.get('originalQuantity'),
            currentQuantity = this.get('currentQuantity');
        if (currentQuantity < originalQuantity) {
            return false;
        }
        return true;
    }.property('currentQuantity'),
    
    newBatch: false,
    
    updateQuantity: 0,

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
                this.set('updateQuantity', (changedAttributes.originalQuantity[1] - changedAttributes.originalQuantity[0]));                
            }
        }
        this.set('costPerUnit', this.get('calculatedCostPerUnit'));
        if (isNew) {
            this.set('newBatch', true);
            this.set('dateAdded', new Date());            
        }        
    },
    
    afterUpdate: function(record) {
        if (this.get('newBatch')) {            
            this.send('addBatch', record);
        } else {
            this.send('updateBatch', record, this.get('updateQuantity'));
        }
    }
});
