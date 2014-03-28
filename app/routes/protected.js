var ProtectedRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    renderTemplate: function() {
        this.render('protected');
    }
});

export default ProtectedRoute;
