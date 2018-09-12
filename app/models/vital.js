import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  // Attributes
  dateRecorded: DS.attr('date'),
  dbp: DS.attr('number'),
  heartRate: DS.attr('number'),
  height: DS.attr('string'),
  respiratoryRate: DS.attr('number'),
  sbp: DS.attr('number'),
  temperature: DS.attr('number'),
  weight: DS.attr('string'),

  validations: {
    temperature: {
      numericality: { allowBlank: true }
    },
    sbp: {
      numericality: { allowBlank: true }
    },
    dbp: {
      numericality: { allowBlank: true }
    },
    heartRate: {
      numericality: { allowBlank: true }
    },
    respiratoryRate: {
      numericality: { allowBlank: true }
    }
  }
});
