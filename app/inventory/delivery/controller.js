import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    
import GetUserName from "hospitalrun/mixins/get-user-name";

export default AbstractEditController.extend(GetUserName, {    
    needs: 'inventory',
    
    fulfillmentTypeList: [
        'Adjustment',
        'Delivery',
        'Write Off'
    ],
    
    deliveryLocationList: Ember.computed.alias('controllers.inventory.deliveryLocationList'),
    
    expenseAccountList: Ember.computed.alias('controllers.inventory.expenseAccountList'),
   
    inventoryItems: Ember.computed.alias('controllers.inventory.model'),
    
    inventoryList: Ember.computed.filter('inventoryItems', function(item) {
        return item.get('type') !== 'Asset';
    }),
    
    inventoryItemChanged: function() {
        Ember.run.once(this, function(){
            this.get('model').validate();
        });
    }.observes('inventoryItem'),    
    
    lookupListsToUpdate: [{
        name: 'deliveryLocationList', //Name of property containing lookup list
        property: 'deliveryLocation', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'delivery_location_list' //Id of the lookup list to update
     }, {
        name: 'expenseAccountList', //Name of property containing lookup list
        property: 'expenseAccount', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'expense_account_list' //Id of the lookup list to update
     }],
    
    actions: {
        update: function() {
            if (this.get('isNew')) {
                this.updateLookupLists();
                this.set('dateRequested', new Date());
                this.set('requestedBy', this.getUserName());
                this.send('fulfillRequest', this.get('model'));
            }
        }
    }
});