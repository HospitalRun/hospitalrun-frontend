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
    }, {
        name: 'Write Off',
        type: 'Write Off'
    }],

    title: 'Adjustment',
    
    transactionTypeChanged: function() {
        Ember.run.once(this, function(){
            this.get('model').validate();
        });
    }.observes('transactionType'),
    
    updateButtonText: function() {
        return this.get('transactionType');
    }.property('transactionType'),
    
    updateButtonAction: 'adjust',
    
    updateCapability: 'adjust_inventory_location',
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        adjust: function() {
            this.send('adjustItems', this.get('model'), true);
        }
    }
});