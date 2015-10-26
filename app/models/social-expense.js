/**
 * Model for social worker family info
 */
import DS from 'ember-data';
import EmberValidations from 'ember-validations';
import { Model } from 'ember-pouch';
export default Model.extend(EmberValidations, {
  category: DS.attr('string'),
  sources: DS.attr('string'),
  cost: DS.attr(),
  validations: {
    category: {
      presence: true
    },
    cost: {
      numericality: true
    }
  }
});
