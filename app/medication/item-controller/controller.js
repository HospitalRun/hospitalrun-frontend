export default Ember.ObjectController.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {    
    needs: ['medication'],
        
    isEditing: false,

    actions: {
        cancelUpdate: function() {
            this.set('isEditing', false);
            var medicationRequest = this.get('model');
            medicationRequest.rollback();            
        },

        deleteRequest: function() {
            var medicationRequest = this.get('model');
            medicationRequest.deleteRecord();      
            medicationRequest.save();    
        },
        
        editRequest: function () {
            this.set('isEditing', true);
        },

        updateRequest: function() {
            this.set('isEditing', false);
            this.get('model').save();
        }
    }
});