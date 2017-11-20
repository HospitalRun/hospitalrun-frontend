import { get } from '@ember/object';
import { isEmpty } from '@ember/utils';
import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

function defaultProcedures() {
  return [];
}

export default AbstractModel.extend({
  // Attributes
  additionalNotes: DS.attr('string'),
  caseComplexity: DS.attr('number'),
  customForms: DS.attr('custom-forms'),
  procedures: DS.attr('operative-procedures', { defaultValue: defaultProcedures }),
  operationDescription: DS.attr('string'),
  surgeon: DS.attr('string'),
  surgeryDate: DS.attr('date'),

  // Associations
  preOpDiagnoses: DS.hasMany('diagnosis'),
  diagnoses: DS.hasMany('diagnosis'), // Post op diagnosis
  operativePlan: DS.belongsTo('operative-plan', { async: true }),
  patient: DS.belongsTo('patient', { async: false }),

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
