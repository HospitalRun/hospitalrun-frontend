import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import VisitTypes from 'hospitalrun/mixins/visit-types';

export default AbstractEditController.extend(PatientSubmodule, VisitTypes, {
    needs: 'appointments',

    dateFormat: 'l h:mm A',
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
    
    newAppointment: false,
    patientAppointments: Ember.computed.alias('patient.appointments'),
    patientList: Ember.computed.alias('controllers.appointments.patientList'),
    physicianList: Ember.computed.alias('controllers.appointments.physicianList'),
    showTime: true,
    
    dateChanged: function() {
        Ember.run.once(this, function(){
            this.get('model').validate();
        });
    }.observes('startDate','endDate'),
    
    updateCapability: 'add_appointment',

    afterUpdate: function(appointment) {
        if (this.get('newAppointment')) {
            var appointments = this.get('patientAppointments'),
                patient = this.get('patient');
            appointments.addObject(appointment);
            patient.save().then(function() {
                this.send(this.get('cancelAction'));            
            }.bind(this));            
        } else {
            this.send(this.get('cancelAction'));
        }
    },

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

    beforeUpdate: function() {
        if (this.get('isNew')) {
            this.set('newAppointment', true);
        }
        return Ember.RSVP.resolve();
    } 

});
