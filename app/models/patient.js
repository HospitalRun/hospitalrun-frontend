import AbstractModel from "hospitalrun/models/abstract";
import DiagnosisValidation from "hospitalrun/mixins/diagnosis-validation";

export default AbstractModel.extend(DiagnosisValidation, {
    address: DS.attr(),
    clinic: DS.attr('string'),
    country: DS.attr('string'),
    bloodType: DS.attr('string'),
    dateOfBirth: DS.attr('string'),
    email: DS.attr('string'),
    firstName: DS.attr('string'),
    gender:  DS.attr('string'),
    history: DS.attr('string'),
    lastName:  DS.attr('string'),
    parent: DS.attr('string'),
    phone:  DS.attr('string'),
    primaryDiagnosis: DS.attr('string'),
    primaryDiagnosisId: DS.attr('string'),
    additionalDiagnoses: DS.attr(), //Yes, the plural of diagnosis is diagnoses!
    
    validations: {
        firstName: {
            presence: true
        },
        lastName: {
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
