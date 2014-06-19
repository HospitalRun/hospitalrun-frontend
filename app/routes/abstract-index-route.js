export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    pageTitle: null,
    setupController: function(controller, model) { 
        this.send('setPageTitle', this.get('pageTitle'));        
        this._super(controller, model);
    }
});