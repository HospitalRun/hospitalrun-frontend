import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  // Attributes
  active: DS.attr('boolean', { defaultValue: true }),
  date: DS.attr('date'),
  diagnosis: DS.attr('string'),
  secondaryDiagnosis: DS.attr('boolean', { defaultValue: false }),

  validations: {
    date: {
      presence: true
    },
    diagnosis: {
      presence: true
    }
  }
});
