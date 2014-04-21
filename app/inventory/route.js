var InventoryRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    model: function() {
        this.controllerFor('navigation').set('allowSearch',true);
        this.controllerFor('navigation').set('searchRoute','inventory.search');
        return this.store.find('inventory');
    }
});

export default InventoryRoute;