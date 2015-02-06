import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import PatientId from 'hospitalrun/mixins/patient-id';
import PouchDbMixin from 'hospitalrun/mixins/pouchdb';
export default AbstractEditRoute.extend(PatientId, PouchDbMixin, {
    editTitle: 'Edit Patient',
    modelName: 'patient',
    newTitle: 'New Patient',
    photos: null,

    actions: {
        appointmentDeleted: function(model) {
            this.controller.send('appointmentDeleted', model);
        },
        
        deleteContact: function(model) {
            this.controller.send('deleteContact', model);
        },
        
        deleteExpense: function(model) {
            this.controller.send('deleteExpense', model);
        },         
        
        deleteFamily: function(model) {
            this.controller.send('deleteFamily', model);
        },        
        
        deletePhoto: function(model) {
            this.controller.send('deletePhoto', model);
        },
        
        updateExpense: function(model) {
            this.controller.send('updateExpense', model);
        },
        
        updateFamilyInfo: function(model) {
            this.controller.send('updateFamilyInfo', model);
        },
        
        visitDeleted: function(model) {
            this.controller.send('visitDeleted', model);
        }
    },
        
    setupController: function(controller, model) {
        this._super(controller, model);
        //Load appointments, photos and visits asynchronously.
        var maxValue = this.get('maxValue'),
            promises = [],
            patientId = 'patient_'+model.get('id');
        
        promises.push(this.store.find('appointment', {
            options: {
                startkey: [patientId,,, 'appointment_'],
                endkey: [patientId, maxValue, maxValue, 'appointment_'+maxValue]
            },
            mapReduce: 'appointments_by_patient'
        }));
        promises.push(this.store.find('photo', {
            options: {
                startkey: [patientId, 'photo_'],
                endkey: [patientId, 'photo_'+maxValue]
            },
            mapReduce: 'photo_by_patient'
        }));
        promises.push(this.store.find('visit', {
            options: {
                startkey: [patientId,,,,'visit_'],
                endkey: [patientId, maxValue, maxValue, maxValue, 'visit_'+maxValue]
            },
            mapReduce: 'visit_by_patient'
        }));
        
        Ember.RSVP.all(promises, 'Retrieving patient child objects').then(function(records) {
            controller.set('appointments', records[0]);
            controller.set('photos', records[1]);
            controller.set('visits', records[2]);
        });
    }
    
});