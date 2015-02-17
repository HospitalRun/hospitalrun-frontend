import Ember from "ember";
import EmberValidations from 'ember-validations';

export default Ember.Object.extend(EmberValidations, {
    profile: null,
    price: null,
    validations: {
        profile: {
            presence: true
        },
        price: {
            numericality: true
        }
    }
});