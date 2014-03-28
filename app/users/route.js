var UsersRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    model: function() {
        return this.store.find('user');
    }
});

export default UsersRoute;