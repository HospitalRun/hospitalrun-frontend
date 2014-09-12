/**
 * Stub model for adding new patient diagnoses; needed for validation.
 */
import DiagnosisValidation from "hospitalrun/utils/diagnosis-validation";

export default Ember.Object.extend(Ember.Validations.Mixin, {
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