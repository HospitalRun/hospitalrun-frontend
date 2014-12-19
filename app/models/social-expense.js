/**
 * Model for social worker family info
 */
import Ember from "ember";
import EmberValidations from 'ember-validations';
export default Ember.Object.extend(EmberValidations, {
    category: null,
    sources: null,
    cost: null,
    validations: {
        cost: {
            numericality: true
        },
    }
});