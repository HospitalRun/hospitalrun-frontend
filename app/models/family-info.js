/**
 * Model for social worker family info
 */
import Ember from "ember";
import EmberValidations from 'ember-validations';
export default Ember.Object.extend(EmberValidations, {
    age: null,
    civilStatus: null,
    education: null,
    income: null,
    insurance: null,
    name: null,
    occupation: null,
    relationship: null,
    validations: {        
        age: {
            numericality: {
                allowBlank: true
            }
        },        
        name: {
            presence: true
        }    
    }
});