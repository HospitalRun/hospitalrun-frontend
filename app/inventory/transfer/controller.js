import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
export default AbstractEditController.extend({
    needs: 'inventory',
    
    warehouseList: Ember.computed.alias('controllers.inventory.warehouseList'),
    aisleLocationList: Ember.computed.alias('controllers.inventory.aisleLocationList'),
    
    lookupListsToUpdate: [{
        name: 'aisleLocationList', //Name of property containing lookup list
        property: 'transferAisleLocation', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'aisle_location_list' //Id of the lookup list to update
    }, {
        name: 'warehouseList', //Name of property containing lookup list
        property: 'transferLocation', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'warehouse_list' //Id of the lookup list to update
    }],
    
    title: 'Transfer Items',
    updateButtonText: 'Transfer',
    updateButtonAction: 'transfer',
    updateCapability: 'adjust_inventory_location',
    
    actions: {
        cancel: function() {
            this.send('closeModal');
        },
        
        transfer: function() {
            this.updateLookupLists();
            this.send('transferItems', this.get('model'), true);           
        }
    }
});