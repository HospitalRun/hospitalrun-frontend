export default Ember.ArrayController.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {    
    actions: {
        newInventory: function() {
            this.transitionToRoute('inventory.new');
        }
    }
});
