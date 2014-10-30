/**
 * Model for social worker family info
 */
export default Ember.Object.extend(Ember.Validations.Mixin, {
    age: null,
    civilStatus: null,
    education: null,
    income: null,
    insurance: null,
    name: null,
    occupation: null,
    relationship: null,
    validations: {
        name: {
            presence: true
        },
    }
});