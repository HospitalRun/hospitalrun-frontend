export default Ember.Route.extend({
    model: function() {
        return this.modelFor('users');
    },
    
    renderTemplate: function(controller){
        this.render({controller: 'users/item-controller'});
    }
});

