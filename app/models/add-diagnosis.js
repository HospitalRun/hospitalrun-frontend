/**
 * Stub model for adding new patient diagnoses; needed for validation.
 */
import DiagnosisValidation from "hospitalrun/utils/diagnosis-validation";
import Ember from "ember";
import EmberValidations from 'ember-validations';

export default Ember.Object.extend(EmberValidations, {
    diagnosis: null,
    diagnosisId: null,
    validations: {
        diagnosis: {
            acceptance: DiagnosisValidation.diagnosisValidation.acceptance,
            length: { 
                minimum: 3,
                allowBlank: true
            }
        }
    }
});