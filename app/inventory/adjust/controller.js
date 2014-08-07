import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
export default AbstractEditController.extend({
    needs: 'inventory',    
        
    adjustmentItemSet: function() {
        this.set('adjustPurchases', true);
    }.observes('adjustmentItem'),
    
    adjustmentTypes: [{
        name: 'Add',
        type: 'Adjustment (Add)'
    }, {
        name: 'Remove',
        type: 'Adjustment (Remove)'
    }],

    title: 'Adjustment',
    updateButtonText: function() {
        return this.get('adjustmentType');
    }.property('adjustmentType'),
    
    updateButtonAction: 'adjust',
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        adjust: function() {
            this.send('adjustItems', this.get('model'), true);           
        }
    }
});