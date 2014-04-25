export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    model: function() {
        this.controllerFor('navigation').set('allowSearch',true);
        this.controllerFor('navigation').set('searchRoute','medication.search');
        return this.store.find('medication');
    }
});

