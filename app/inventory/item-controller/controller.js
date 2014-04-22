export default Ember.ObjectController.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    
    needs: ['inventory'],
    
    isEditing: false,
    
    actions: {
        cancelUpdate: function() {
            this.set('isEditing', false);
            this.get('model').rollback();
        },
        
        deleteInventory: function() {
            var inventory = this.get('model'); 
            inventory.deleteRecord();      
            inventory.save();    
        },
        
        editInventory: function () {
            this.set('isEditing', true);
        },

        updateInventory: function() {
            this.set('isEditing', false);
            this.get('model').save();
        }
    }
});
