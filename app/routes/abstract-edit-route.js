export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    editTitle: null,
    newTitle: null,
    setupController: function(controller, model) { 
        if (model.get('isNew')) {                        
            this.send('setPageTitle', this.get('newTitle'));
        } else {
            this.send('setPageTitle', this.get('editTitle'));
        }
        this._super(controller, model);
    }
});