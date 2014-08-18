import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(PatientSubmodule, {
    needs: 'medication',

    durationTypes: [
        'Days',
        'Weeks'
    ],
    
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
        }
        return Ember.RSVP.resolve();
    } 

});
