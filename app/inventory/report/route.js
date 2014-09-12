export default Ember.Route.extend({
    afterModel: function() {
        this.set('inventoryItems', this.modelFor('inventory'));
    },
    
    model: function() {
        return this.store.find('inv-request', {
            adjustPurchases: true,
            status: 'Completed'
        });
    },
    
    setupController: function(controller, model) {
        controller.set('inventoryItems', this.modelFor('inventory'));
        this._super(controller, model);
    }

});
