import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";
export default AbstractEditController.extend({
    needs: 'inventory',    
    
    adjustmentTypes: [{
        name: 'Add',
        type: 'Adjustment (Add)'
    }, {
        name: 'Remove',
        type: 'Adjustment (Remove)'
    }, {
        name: 'Return To Vendor',
        type: 'Return To Vendor'
    }, {
        name: 'Write Off',
        type: 'Write Off'
    }],
    
    expenseAccountList: Ember.computed.alias('controllers.inventory.expenseAccountList'),

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