/**
 * Stub model for adding new patient diagnoses; needed for validation.
 */
import DiagnosisValidation from "hospitalrun/utils/diagnosis-validation";

export default Ember.Object.extend(Ember.Validations.Mixin, DiagnosisValidation, {
    diagnosis: null,
    diagnosisId: null,
    validations: {
        diagnosis: DiagnosisValidation.diagnosisValidation
    }
});