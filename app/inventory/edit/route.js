import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import InventoryId from 'hospitalrun/mixins/inventory-id';
export default AbstractEditRoute.extend(InventoryId, {
    editTitle: 'Edit Item',
    modelName: 'inventory',
    newTitle: 'New Item',
    
    actions: {        
        adjustItems: function(inventoryLocation) {
            this.controller.send('adjustItems',inventoryLocation);
        },
        
        deletePurchase: function(purchase, deleteFromLocation) {
            this.controller.send('deletePurchase', purchase, deleteFromLocation);
        },
        
        expirePurchase: function(purchase, deleteFromLocation) {
            this.controller.send('deletePurchase', purchase, deleteFromLocation, true);
        },
        
        transferItems: function(inventoryLocation) {
            this.controller.send('transferItems',inventoryLocation);
        },        
        
        updatePurchase: function(purchase, updateQuantity) {
            this.controller.send('updatePurchase', purchase, updateQuantity);
        }                        
    },
    
    getNewData: function() {
        return Ember.RSVP.resolve({
            dateReceived: new Date()
        });
    }
});