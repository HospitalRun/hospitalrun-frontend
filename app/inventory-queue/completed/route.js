export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {    
    model: function() {                
        return this.store.filter('inv-request', {status: 'Fulfilled'});
    },
});