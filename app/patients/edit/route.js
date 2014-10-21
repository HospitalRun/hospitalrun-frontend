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
        },                
    },
    
    afterModel: function(patient) {
        return new Ember.RSVP.Promise(function(resolve, reject){
            this.store.find('photo', {
                patient: 'patient_'+patient.get('id')
            }).then(function(photos) {
                this.set('photos', photos);
                resolve();
            }.bind(this), function(err) {
                reject(err);
            });
        }.bind(this));
    },
    
    setupController: function(controller, model) {        
        this._super(controller, model);
        controller.set('photos', this.get('photos'));
    }
});