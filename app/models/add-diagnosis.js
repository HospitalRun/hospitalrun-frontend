/**
 * Stub model for adding new patient diagnoses; needed for validation.
 */
import DS from 'ember-data';
import EmberValidations from 'ember-validations';
import { Model } from 'ember-pouch';

export default Model.extend(EmberValidations, {
  diagnosis: DS.attr('string'),
  validations: {
    diagnosis: {
      presence: true
    }
  }
});
