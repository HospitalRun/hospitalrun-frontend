import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";

export default AbstractEditController.extend({
    needs: 'inventory',
    cancelAction: 'closeModal',
    
    canEditQuantity: function() {
        var originalQuantity = this.get('originalQuantity'),
            currentQuantity = this.get('currentQuantity');
        if (currentQuantity < originalQuantity) {
            return false;
        }
        return true;
    }.property('currentQuantity'),
    
    warehouseList: Ember.computed.alias('controllers.inventory.warehouseList'),
    aisleLocationList: Ember.computed.alias('controllers.inventory.aisleLocationList'),
    vendorList: Ember.computed.alias('controllers.inventory.vendorList'),
    
    lookupListsToUpdate: [{
        name: 'aisleLocationList', //Name of property containing lookup list
        property: 'aisleLocation', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'aisle_location_list' //Id of the lookup list to update
     }, {
        name: 'vendorList', //Name of property containing lookup list
        property: 'vendor', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'vendor_list' //Id of the lookup list to update
    }, {
        name: 'warehouseList', //Name of property containing lookup list
        property: 'location', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'warehouse_list' //Id of the lookup list to update
     }],
    
    newPurchase: false,
    
    updateQuantity: false,
    
    updateCapability: 'add_inventory_purchase',

    title: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add Purchase';
        }
        return 'Edit Purchase';
	}.property('isNew'),
    
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
            this.set('newPurchase', true);         
        }
        return Ember.RSVP.Promise.resolve();
    },
    
    afterUpdate: function(record) {
        if (this.get('newPurchase')) {            
            this.send('addPurchase', record);
        } else {
            this.send('updatePurchase', record, true);
        }
    }
});
