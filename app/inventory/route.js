var InventoryRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    model: function() {
        return this.store.find('inventory');
    }
});

export default InventoryRoute;