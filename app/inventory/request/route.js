import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
export default AbstractEditRoute.extend({
  editTitle: 'Edit Request',
  modelName: 'inv-request',
  newTitle: 'New Request',
  database: Ember.inject.service(),
  getNewData: function() {
    return Ember.RSVP.resolve({
      transactionType: 'Request',
      requestedItems: []
    });
  },

  actions: {
    allRequests: function(model) {
      this.controller.send('allRequests', model);
    },

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
      startkey: 'inventory_',
      endkey: 'inventory_\uffff',
      include_docs: true
    };
    this.get('database').queryMainDB(inventoryQuery).then(function(result) {
      controller.set('inventoryItems', result.rows);
    });
  }
});
