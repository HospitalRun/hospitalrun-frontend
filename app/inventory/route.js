var InventoryRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    model: function() {
        return this.store.find('inventory');
    },
    
    setupController: function(controller, model) { 
        this.controllerFor('navigation').set('allowSearch',true);
        this.controllerFor('navigation').set('searchRoute','inventory.search');
        this._super(controller, model);
    }
});

export default InventoryRoute;