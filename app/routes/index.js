export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    afterModel: function() {
        this.controllerFor('navigation').set('allowSearch',false);
    }
});

