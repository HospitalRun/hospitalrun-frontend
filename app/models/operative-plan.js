import { get, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import { PLANNED_STATUS } from 'hospitalrun/mixins/operative-plan-statuses';

function defaultProcedures() {
  return [];
}

export default AbstractModel.extend({
  // Attributes
  additionalNotes: DS.attr('string'),
  admissionInstructions: DS.attr('string'),
  caseComplexity: DS.attr('number'),
  customForms: DS.attr('custom-forms'),
  operationDescription: DS.attr('string'),
  procedures: DS.attr('operative-procedures', { defaultValue: defaultProcedures }),
  status: DS.attr('string', { defaultValue: PLANNED_STATUS }),
  surgeon: DS.attr('string'),

  // Associations
  diagnoses: DS.hasMany('diagnosis'),
  patient: DS.belongsTo('patient', { async: false }),

  isPlanned: computed('status', {
    get() {
      let status = get(this, 'status');
      return status === PLANNED_STATUS;
    }
  }),

  validations: {
    caseComplexity: {
      numericality: {
        allowBlank: true,
        onlyInteger: true
      }
    },

    procedureDescription: {
      presence: {
        if(object) {
          return isEmpty(get(object, 'procedures'));
        }
      }
    }
  }
});
