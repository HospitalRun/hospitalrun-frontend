import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  // Attributes
  reportDate: DS.attr('date'),
  customForms: DS.attr('custom-forms'),
  reportType: DS.attr('string'),

  // Associations
  visit: DS.belongsTo('visit', { async: false }),

  validations: {
    visit: {
      presence: true
    },

    reportDate: {
      presence: true
    }
  }
});
