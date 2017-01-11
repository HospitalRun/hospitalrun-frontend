import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
import { PLANNED_STATUS } from 'hospitalrun/mixins/operative-plan-statuses';

const {
  computed,
  get,
  isEmpty
} = Ember;

function defaultProcedures() {
  return [];
}

export default AbstractModel.extend({
  // Attributes
  additionalNotes: DS.attr('string'),
  admissionInstructions: DS.attr('string'),
  caseComplexity: DS.attr('string'),
  customForms: DS.attr('custom-forms'),
  operationDescription: DS.attr('string'),
  procedures: DS.attr('operative-procedures', { defaultValue: defaultProcedures }),
  status: DS.attr('string', { defaultValue: PLANNED_STATUS }),
  surgeon: DS.attr('string'),
  surgeryDate: DS.attr('date'),

  // Associations
  patient: DS.belongsTo('patient', { async: false }),

  isPlanned: computed('status', {
    get() {
      let status = get(this, 'status');
      return status === PLANNED_STATUS;
    }
  }),

  validations: {
    procedureDescription: {
      presence: {
        if(object) {
          return isEmpty(get(object, 'procedures'));
        }
      }
    }
  }
});
