import Ember from 'ember';
export default Ember.Component.extend({    
    disablePatientLink: false,
    editProcedureAction: 'editProcedure',
    patient: null,
    patientProcedures: null,
    showPatientAction: 'showPatient',
    visits: null,
    
    _addDiagnosisToList: function(diagnosis, diagnosesList, visit) {
        if (!Ember.isEmpty(diagnosis)) {            
            if (Ember.isEmpty(diagnosesList.findBy('description', diagnosis))) {
                diagnosesList.addObject({
                    date: visit.get('startDate'),
                    description: diagnosis
                });
            }
        }
    },    
    
    havePrimaryDiagnoses: function() {
        var primaryDiagnosesLength = this.get('primaryDiagnoses.length');
        return (primaryDiagnosesLength > 0);
    }.property('primaryDiagnoses.length'),    

    haveProcedures: function() {
        var proceduresLength = this.get('patientProcedures.length');
        return (proceduresLength > 0);
    }.property('patientProcedures.length'),    
    
    haveSecondaryDiagnoses: function() {
        var secondaryDiagnosesLength = this.get('secondaryDiagnoses.length');
        return (secondaryDiagnosesLength > 0);
    }.property('secondaryDiagnoses.length'),    
    
    primaryDiagnoses: function() {
        var diagnosesList = [],
            visits = this.get('visits');        
        if (!Ember.isEmpty(visits)) {
            visits.forEach(function(visit) {
                this._addDiagnosisToList(visit.get('primaryDiagnosis'), diagnosesList, visit);
                this._addDiagnosisToList(visit.get('primaryBillingDiagnosis'), diagnosesList, visit);
            }.bind(this));
        }
        var firstDiagnosis = diagnosesList.get('firstObject');
        if (!Ember.isEmpty(firstDiagnosis)) {
            firstDiagnosis.first = true;
        }
        return diagnosesList;
    }.property('visits.@each'),
    
    secondaryDiagnoses: function() {
        var diagnosesList = [],
            visits = this.get('visits');        
        if (!Ember.isEmpty(visits)) {
            visits.forEach(function(visit) {                
                if (!Ember.isEmpty(visit.get('additionalDiagnoses'))) {
                    diagnosesList.addObjects(visit.get('additionalDiagnoses'));
                }
            });
        }
        
        var firstDiagnosis = diagnosesList.get('firstObject');
        if (!Ember.isEmpty(firstDiagnosis)) {
            firstDiagnosis.first = true;
        }
        return diagnosesList;
    }.property('visits.@each'),
    
    shouldLinkToPatient: function() {
        var disablePatientLink = this.get('disablePatientLink');
        return !disablePatientLink;
    }.property('disablePatientLink'),
    
    actions: {
        linkToPatient: function() {
            var shouldLink = this.get('shouldLinkToPatient');
            if (shouldLink) {
                var patient = this.get('patient'),
                    returnTo = this.get('returnTo'),
                    returnToContext = this.get('returnToContext');
                patient.set('returnTo', returnTo);
                patient.set('returnToContext', returnToContext);
                this.sendAction('showPatientAction', this.get('patient'));
            }
        },        
        editProcedure: function(procedure) {
            procedure.set('returnToVisit', false);
            procedure.set('returnToPatient', true);
            procedure.set('patient', this.get('patient'));
            this.sendAction('editProcedureAction', procedure);
        },
    }
});