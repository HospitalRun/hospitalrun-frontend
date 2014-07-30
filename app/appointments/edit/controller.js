import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    
import VisitTypes from 'hospitalrun/mixins/visit-types';

export default AbstractEditController.extend(VisitTypes, {
    needs: 'appointments',

    cancelAction: function() {
        var returnToPatient = this.get('returnToPatient');
        if (returnToPatient) {
            return 'returnToPatient';
        } else {
            return 'allItems';
        }                
    }.property('returnToPatient'),
    
    patientList: Ember.computed.alias('controllers.appointments.patientList'),
    physicianList: Ember.computed.alias('controllers.appointments.physicianList'),
    locationList: Ember.computed.alias('controllers.appointments.locationList'),
    lookupListsToUpdate: [{
        name: 'physicianList',
        property: 'provider',
        id: 'physician_list'
    }, {
        name: 'locationList',
        property: 'location',
        id: 'location_list'
    }],
    
    dateFormat: 'l h:mm A',
    showTime: true,
    
    patient: Ember.computed.alias('model.patient'),
    patientId: Ember.computed.alias('patient.id'),
    patientAppointments: Ember.computed.alias('patient.appointments'),
    
    patientIdChanged: function() {
        var patientId = this.get('patientId');
        if (!Ember.isEmpty(patientId)) {
            this.set('returnPatientId', patientId);
        }
    }.observes('patientId').on('init'),
    
    returnPatientId: null,

    allDayChanged: function() {
        var allDay = this.get('allDay');
        if (allDay) {
            this.set('dateFormat', 'l');
            this.set('showTime', false);
        } else {
            this.set('dateFormat', 'l h:mm A');
            this.set('showTime', true);
        }
    }.observes('allDay'),
    
    actions: {
        returnToPatient: function() {
            this.transitionToRoute('patients.edit', this.get('returnPatientId'));
        }                
    },

    afterUpdate: function() {
        this.send(this.get('cancelAction'));
    },
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            return new Ember.RSVP.Promise(function(resolve){
                this.get('patientAppointments').then(function(patientAppointments){
                    var visit = this.get('model');
                    patientAppointments.addObject(visit);
                    var patient = this.get('patient');
                    patient.save().then(resolve);
                }.bind(this));
            }.bind(this));
        } else {
            Ember.RSVP.resolve();
        }
    }    

});
