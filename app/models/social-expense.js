/**
 * Model for social worker family info
 */
export default Ember.Object.extend(Ember.Validations.Mixin, {
    category: null,
    sources: null,
    cost: null,
    validations: {
        cost: {
            numericality: true
        },
    }
});