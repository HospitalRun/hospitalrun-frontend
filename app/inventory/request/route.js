import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
export default AbstractEditRoute.extend({
    editTitle: 'Edit Request',
    modelName: 'inv-request',
    newTitle: 'New Request',
    pouchdb: Ember.inject.service(),
    getNewData: function() {
        return Ember.RSVP.resolve({
            transactionType: 'Request',
            requestedItems: []
        });
    },
    
    actions: {
        removeItem: function(model) {
            this.controller.send('removeItem', model);
        }
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
        this.get('pouchdb').queryMainDB(inventoryQuery).then(function(result) {            
            controller.set('inventoryItems', result.rows);
        });        
    }
});