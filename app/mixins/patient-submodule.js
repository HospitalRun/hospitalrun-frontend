export default Ember.Mixin.create({
    actions: {
        returnToPatient: function() {
            this.transitionToRoute('patients.edit', this.get('returnPatientId'));
        }                
    },

    cancelAction: function() {
        var returnToPatient = this.get('returnToPatient');
        if (returnToPatient) {
            return 'returnToPatient';
        } else {
            return 'allItems';
        }                
    }.property('returnToPatient'),   

    patientChanged: function() {
        var patient = this.get('patient');
        if (!Ember.isEmpty(patient)) {
            //Make sure all the async relationships are resolved    
            patient.get('appointments');
            patient.get('medication');
            patient.get('visits');
        }
    }.observes('patient'),
    
    patientId: Ember.computed.alias('patient.id'),
    
    patientIdChanged: function() {
        var patientId = this.get('patientId');
        if (!Ember.isEmpty(patientId)) {
            this.set('returnPatientId', patientId);
        }
    }.observes('patientId').on('init'),
    
    returnPatientId: null,
    
});