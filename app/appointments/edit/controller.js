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
    
    patientId: Ember.computed.alias('patient.id'),
    patientAppointments: Ember.computed.alias('patient.appointments'),
    
    patientIdChanged: function() {
        var patientId = this.get('patientId');
        if (!Ember.isEmpty(patientId)) {
            this.set('returnPatientId', patientId);
        }
    }.observes('patientId').on('init'),
    
    patientChanged: function() {
        var patient = this.get('patient');
        if (!Ember.isEmpty(patient)) {
            //Make sure all the async relationships are resolved    
            patient.get('appointments');
            patient.get('visits');
        }
    }.observes('patient'),
    
    returnPatientId: null,

    allDayChanged: function() {
        var allDay = this.get('allDay');
        if (allDay) {
            var endDate = this.get('endDate'),
                startDate = this.get('startDate');
            this.set('startDate', moment(startDate).startOf('day').toDate());
            this.set('endDate', moment(endDate).endOf('day').toDate());
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
        if (this.get('newAppointment')) {
            var appointment = this.get('model'),                
                appointments = this.get('patientAppointments'),
                patient = this.get('patient');
                appointments.addObject(appointment);
                patient.save().then(function() {
                    this.send(this.get('cancelAction'));            
                }.bind(this));            
        } else {
            this.send(this.get('cancelAction'));
        }
    },
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            this.set('newAppointment', true);
        }
        return Ember.RSVP.resolve();
    }    

});
