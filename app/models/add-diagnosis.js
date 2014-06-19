import DiagnosisValidation from "hospitalrun/mixins/diagnosis-validation";

export default Ember.Object.extend(Ember.Validations.Mixin, DiagnosisValidation, {
    diagnosis: null,
    diagnosisId: null,
        
    init: function() {
        //Setup validation here because we are using a mixin for it.
        this.validations = {
            diagnosis: {
                acceptance: this.diagnosisValidation
            }
        };
        this._super();
    }
});