export default Ember.ArrayController.extend({    
    actions: {
        newMedication: function() {
            this.transitionToRoute('medication.new');
        }
    }
});
