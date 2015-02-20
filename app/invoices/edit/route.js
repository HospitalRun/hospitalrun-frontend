import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
export default AbstractEditRoute.extend(PatientListRoute, {
    editTitle: 'Edit Invoice',
    modelName: 'invoice',
    newTitle: 'New Invoice',
    
    actions: {
        deleteCharge: function(model) {
            this.controller.send('deleteCharge', model);
        },
        
        deleteLineItem: function(model) {
            this.controller.send('deleteLineItem', model);
        },
    },
    
    getNewData: function() {
        return Ember.RSVP.resolve({
            billDate: new Date(),
            selectPatient: true            
        });
    }
});