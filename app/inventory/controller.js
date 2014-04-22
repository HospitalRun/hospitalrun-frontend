export default Ember.ArrayController.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {    
    actions: {
        newInventory: function() {
            console.log("new inventory in inventory main controller");
            this.transitionToRoute('/inventory/new');
        }
    }
});
