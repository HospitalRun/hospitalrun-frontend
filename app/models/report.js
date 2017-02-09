import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  // Attributes
  description: DS.attr('string'),
  reportDate: DS.attr('date'),
  customForms: DS.attr('custom-forms'),

  // Associations
  visit: DS.belongsTo('visit', { async: false }),

  validations: {
    description: {
      presence: true
    },

    reportDate: {
      presence: true
    },
    display_reportDate: {
      presence: {
        message: 'Please select a valid date'
      }
    }
  }
});
