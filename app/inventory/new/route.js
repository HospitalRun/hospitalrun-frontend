export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    setupController: function(controller, model) {
        controller.set('model', model);
        controller.set('isValidRecord',true);
    }
});

