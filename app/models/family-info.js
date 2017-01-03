/**
 * Model for social worker family info
 */
import DS from 'ember-data';
import EmberValidations from 'ember-validations';
import { Model } from 'ember-pouch';

export default Model.extend(EmberValidations, {
  // Attributes
  age: DS.attr('number'),
  civilStatus: DS.attr('string'),
  education: DS.attr('string'),
  income: DS.attr('string'),
  insurance: DS.attr('string'),
  name: DS.attr('string'),
  occupation: DS.attr('string'),
  relationship: DS.attr('string'),
  // Validations
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
