export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    fulfilled: function(item) {
        return item.get('status') === 'Fulfilled';
    },
    
    model: function() {                
        return this.store.filter('inv-request', this.fulfilled);
    },
    
    renderTemplate: function(controller){
        this.render('inventory.index', {controller: controller});
    }
});