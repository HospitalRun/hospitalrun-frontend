export default Ember.ArrayController.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {    
    actions: {
        newMedication: function() {
            this.transitionToRoute('medication.new');
        }
    }
});
