import AbstractModel from "hospitalrun/models/abstract";
import DiagnosisValidation from "hospitalrun/utils/diagnosis-validation";
import EmailValidation from "hospitalrun/utils/email-validation";

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
        email: {
            format: { 
                with: EmailValidation.emailRegex, 
                allowBlank: true, 
                message: 'please enter a valid email address'
            }
        },
        firstName: {
            presence: true
        },
        lastName: {
            presence: true
        },
        
        primaryDiagnosis: DiagnosisValidation.diagnosisValidation
    }

});