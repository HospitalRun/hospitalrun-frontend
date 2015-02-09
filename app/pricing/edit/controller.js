import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
export default AbstractEditController.extend({
    needs: ['pricing'],
    categories: [
        'Imaging',
        'Lab',
        'Procedure',
        'Ward'
    ],
    expenseAccountList: Ember.computed.alias('controllers.pricing.expenseAccountList'),
    pricingTypes: Ember.computed.alias('controllers.pricing.pricingTypes'),
    
    lookupListsToUpdate: [{
        name: 'expenseAccountList', //Name of property containing lookup list
        property: 'expenseAccount', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'expense_account_list' //Id of the lookup list to update
    }, {        
        name: 'pricingTypes', //Name of property containing lookup list
        property: 'type', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'pricing_types' //Id of the lookup list to update
    }],
    
    updateCapability: 'add_pricing',
    
    afterUpdate: function(record) {
        var message =  'The pricing record for %@ has been saved.'.fmt(record.get('name'));
        this.displayAlert('Pricing Item Saved', message);        
    }
});