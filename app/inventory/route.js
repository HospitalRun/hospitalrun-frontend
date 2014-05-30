var InventoryRoute = Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    actions: {
        newInventory: function() {
            this.render('inventory.new', {
                into: 'application',
                outlet: 'modal'
            });
        },

/*        
        editInventory: function(item) {
            this.controllerFor('inventory.edit').set('model',item);
            this.render('inventory.edit', {
                into: 'application',
                outlet: 'modal'
            });            
        },
*/
        closeModal: function() {
            this.disconnectOutlet({
                parentView: 'application',
                outlet: 'modal'
            });
        }
    },
    
    model: function() {
        return this.store.find('inventory');
    },
    
    setupController: function(controller, model) { 
        this.controllerFor('navigation').set('allowSearch',true);
        this.controllerFor('navigation').set('searchRoute','/inventory/search');
        this._super(controller, model);
    }
});

export default InventoryRoute;