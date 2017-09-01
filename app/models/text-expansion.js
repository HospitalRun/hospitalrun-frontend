import DS from 'ember-data';
import EmberValidations from 'ember-validations';
import { Model } from 'ember-pouch';

export default Model.extend(EmberValidations, {
  from: DS.attr('string'),
  to: DS.attr('string'),

  validations: {
    from: {
      presence: true
    },
    to: {
      presence: true
    }
  }
});
