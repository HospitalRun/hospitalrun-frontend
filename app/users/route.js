export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    actions: {
        allItems: function() {
            this.transitionTo('users.index');
        }
    }
});