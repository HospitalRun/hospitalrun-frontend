import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(PatientSubmodule, {
    needs: 'medication',

    durationTypes: [
        'Days',
        'Weeks'
    ],
    
    isFulfilling: function() {
        var isRequested = this.get('isRequested'),
            fulfillRequest = this.get('shouldFulfillRequest');
        return isRequested || fulfillRequest;
    }.property('isRequested', 'shouldFulfillRequest'),

    isRequested: function() {
        var status = this.get('status');
        return (status === 'Requested');
    }.property('status'),
    
    medicationList: Ember.computed.alias('controllers.medication.medicationList'),
    patientList: Ember.computed.alias('controllers.medication.patientList'),
    patientMedication: Ember.computed.alias('patient.medication'),

    afterUpdate: function(medication) {
        if (this.get('newMedication')) {
            var medications = this.get('patientMedication'),
                patient = this.get('patient');
            medications.addObject(medication);
            patient.save().then(function() {
                this.send(this.get('cancelAction'));            
            }.bind(this));            
        } else {
            this.send(this.get('cancelAction'));
        }
    },
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            this.set('newMedication', true);
            this.set('status', 'Requested');
        }
        return Ember.RSVP.resolve();
    } 

});