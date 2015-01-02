import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
export default AbstractEditRoute.extend({
    editTitle: 'Edit Request',
    modelName: 'inv-request',
    newTitle: 'New Request',
    getNewData: function() {
        return {
            transactionType: 'Request'
        };
    },
    
    /**
     * Lazily load inventory items so that it doesn't impact performance.
     */
    setupController: function(controller, model) {
        this._super(controller, model);
        var inventoryQuery = {
            startkey:  'inventory_',
            endkey: 'inventory_\uffff',
            include_docs: true,
        };
        this.controllerFor('pouchdb').queryMainDB(inventoryQuery).then(function(result) {            
            controller.set('inventoryItems', result.rows);
        });        
    }
});