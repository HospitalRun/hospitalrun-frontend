import InventoryRequestRoute from 'hospitalrun/inventory/request/route';
import Ember from 'ember';
export default InventoryRequestRoute.extend({
    editTitle: 'Invoice Received',
    modelName: 'inventory-invoice',
    newTitle: 'Invoice Received',
    getNewData: function() {
        return Ember.RSVP.resolve({
            invoiceItems: []
        });
    },
    
    actions: {
        addedNewInventoryItem: function(model) {
            this.controller.send('addedNewInventoryItem', model);
        }
    },
});