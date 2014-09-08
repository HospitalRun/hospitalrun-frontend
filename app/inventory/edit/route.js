import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import InventoryId from "hospitalrun/mixins/inventory-id";
export default AbstractEditRoute.extend(InventoryId, {
    editTitle: 'Edit Item',    
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
    
    model: function(params) {
        if (params.inventory_id === 'new') {
            var data = {
                id: this.generateInventoryId(),
                type: 'Asset'
            };
            return this.get('store').createRecord('inventory', data);    
        } else {
            return this._super(params);
        }
    }
});