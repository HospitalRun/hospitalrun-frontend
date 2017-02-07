
import EmberValidations from 'ember-validations';
import DS from 'ember-data';

export default DS.Model.extend(EmberValidations, {
  checkboxes: DS.attr(),
  classNames: DS.attr('string'),
  colSpan: DS.attr('number'),
  includeOtherOption: DS.attr('boolean'),
  label: DS.attr('string'),
  otherOptionLabel: DS.attr('string'),
  prompt: DS.attr('string'),
  property: DS.attr('string'),
  type: DS.attr('string'),
  values: DS.attr('string'),
  validations: {
    colSpan: {
      numericality: {
        allowBlank: true,
        onlyInteger: true
      }
    },
    label: {
      presence: true
    },
    type: {
      presence: true
    }
  }
});
