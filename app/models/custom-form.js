import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

function defaultFields() {
  return [];
}

export default AbstractModel.extend({
  alwaysInclude: DS.attr('boolean'),
  columns: DS.attr('number', { defaultValue: 1 }),
  fields: DS.attr('custom-fields', { defaultValue: defaultFields }),
  formType: DS.attr('string'),
  name: DS.attr('string'),

  validations: {
    formType: {
      presence: true
    },
    name: {
      presence: true
    },
    columns: {
      numericality: {
        allowBlank: true,
        onlyInteger: true,
        lessThanOrEqualTo: 12
      }
    }
  }
});
