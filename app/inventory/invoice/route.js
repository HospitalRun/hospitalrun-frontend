import InventoryRequestRoute from 'hospitalrun/inventory/request/route';
import Ember from 'ember';
export default InventoryRequestRoute.extend({
    editTitle: 'Invoice Received',
    modelName: 'inventory-invoice',
    newTitle: 'Invoice Received',
    getNewData: function() {
        return Ember.RSVP.resolve({
            invoiceItems: [],
            dateReceived: new Date()
        });
    },
    
    actions: {
        addedNewInventoryItem: function(model) {
            this.controller.send('addedNewInventoryItem', model);
        }
    },
});