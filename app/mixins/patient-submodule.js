export default Ember.Mixin.create({
    actions: {
        returnToPatient: function() {
            this.transitionToRoute('patients.edit', this.get('returnPatientId'));
        },        
        returnToVisit: function() {
            this.transitionToRoute('visits.edit', this.get('returnVisitId'));
        }
    },

    cancelAction: function() {
        var returnToPatient = this.get('returnToPatient'),
            returnToVisit = this.get('returnToVisit');
        if (returnToVisit) {
            return 'returnToVisit';
        } else if (returnToPatient) {
            return 'returnToPatient';
        } else {
            return 'allItems';
        }
    }.property('returnToPatient', 'returnToVisit'),

    patientChanged: function() {
        var patient = this.get('patient');
        if (!Ember.isEmpty(patient)) {
            //Make sure all the async relationships are resolved    
            patient.get('appointments');
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
    returnVisitId: null,
    
    visitChanged: function() {
        var visit = this.get('visit');
        if (!Ember.isEmpty(visit)) {
            //Make sure all the async relationships are resolved    
            visit.get('labs');
            visit.get('medication');
            visit.get('procedures');
            visit.get('vitals');            
        }
    }.observes('visit'),    

    visitIdChanged: function() {
        var visitId = this.get('visitId');
        if (!Ember.isEmpty(visitId)) {
            this.set('returnVisitId', visitId);
        }
    }.observes('visitId').on('init'),

    visitId: Ember.computed.alias('visit.id'),
});