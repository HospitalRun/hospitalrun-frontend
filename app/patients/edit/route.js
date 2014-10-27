import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import PatientId from 'hospitalrun/mixins/patient-id';
export default AbstractEditRoute.extend(PatientId, {
    editTitle: 'Edit Patient',
    modelName: 'patient',
    newTitle: 'New Patient',
    photos: null,
    
    actions: {
        deletePhoto: function(model) {
            this.controller.send('deletePhoto', model);
        }
    },
        
    setupController: function(controller, model) {
        this._super(controller, model);
        //Load appointments, photos and visits asynchronously.
        var promises = [],
            patientId = 'patient_'+model.get('id');

        promises.push(this.store.find('appointment', {
            patient: patientId
        }));            
        promises.push(this.store.find('photo', {                
            patient: patientId
        }));
        promises.push(this.store.find('visit', {
            patient: patientId
        }));
        Ember.RSVP.all(promises, 'Retrieving patient child objects').then(function(records) {
            controller.set('appointments', records[0]);
            controller.set('photos', records[1]);
            controller.set('visits', records[2]);                
        });
    }
    
});