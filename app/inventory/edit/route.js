import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
export default AbstractEditRoute.extend({
    editTitle: 'Edit Item',    
    newTitle: 'New Item',
    
    actions: {        
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
    }
});