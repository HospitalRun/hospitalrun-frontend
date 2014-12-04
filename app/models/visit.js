import AbstractModel from "hospitalrun/models/abstract";
import DiagnosisValidation from "hospitalrun/utils/diagnosis-validation";

export default AbstractModel.extend({
    additionalDiagnoses: DS.attr(), //Yes, the plural of diagnosis is diagnoses!
    clinic: DS.attr('string'),
    endDate:  DS.attr('date'),  //if visit type is outpatient, startDate and endDate are equal 
    examiner: DS.attr('string'),
    history: DS.attr('string'),
    imaging: DS.hasMany('imaging', {async: true}),
    labs: DS.hasMany('lab', {async: true}),
    location: DS.attr('string'),
    medication: DS.hasMany('medication', {async: true}),
    notes: DS.attr('string'),
    patient: DS.belongsTo('patient'),
    primaryDiagnosis: DS.attr('string'),
    primaryDiagnosisId: DS.attr('string'),
    procedures: DS.hasMany('procedure', {async: true}),
    startDate:  DS.attr('date'),
    visitType: DS.attr(),        
    vitals: DS.hasMany('vital', {async: true}),
    
    diagnosisList: function() {
        var additionalDiagnosis = this.get('additionalDiagnoses'),
            diagnosisList = [],
            primaryDiagnosis = this.get('primaryDiagnosis');
        if (!Ember.isEmpty(primaryDiagnosis)) {
            diagnosisList.push(primaryDiagnosis);
        }
        if (!Ember.isEmpty(additionalDiagnosis)) {
            diagnosisList.addObjects(additionalDiagnosis.map(function(diagnosis) {
                return diagnosis.description;
            }));
        }
        return diagnosisList;
    }.property('additionalDiagnosis@each','primaryDiagnosis'),
            
    visitDate: function() {
        var endDate = this.get('endDate'),
            startDate = moment(this.get('startDate')),
            visitDate = startDate.format('l');
        if (!Ember.isEmpty(endDate) && !startDate.isSame(endDate, 'day')) {
            visitDate += ' - ' + moment(endDate).format('l');                                                
        }
        return visitDate;
    }.property('startDate', 'endDate'),
    
    visitDescription: function() {
        var visitDate = this.get('visitDate'),
            visitType = this.get('visitType');
        return '%@ (%@)'.fmt(visitDate, visitType);
    }.property('visitDate', 'visitType'),
    
    validations: {
        startDate: {
            presence: true
        },
        visitType: {
            presence: true
        },
        
        primaryDiagnosis: {            
            acceptance: DiagnosisValidation.diagnosisValidation.acceptance,
            length: { 
                allowBlank: true,
                minimum: 3
            }
        }
    }

});