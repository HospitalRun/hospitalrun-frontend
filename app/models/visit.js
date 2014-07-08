import AbstractModel from "hospitalrun/models/abstract";
import DiagnosisValidation from "hospitalrun/utils/diagnosis-validation";

export default AbstractModel.extend(DiagnosisValidation, {
    patientId: DS.attr('string'),
    staffId: DS.attr('string'),
    locationId: DS.attr('string'),
    visitType: DS.attr(),        
    clinic: DS.attr('string'),
    startDate:  DS.attr('date'),
    endDate:  DS.attr('date'),  //if visit type is outpatient, startDate and endDate are equal 
    history: DS.attr('string'),
    notes: DS.attr('string'),
    charts: DS.attr(),
    procedures: DS.attr(),
    validations: {
        patientId: {
            presence: true
        },
        startDate: {
            presence: true
        },
        visitType: {
            presence: true
        }
    },
    
    init: function() {
        //Setup primaryDiagnosis validation here because we are using a mixin for it.
        this.validations.primaryDiagnosis = {
            acceptance: this.diagnosisValidation
        };
        this._super();
    }

});
