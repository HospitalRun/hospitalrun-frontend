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
      numericality: true
    },
    sbp: {
      numericality: true
    },
    dbp: {
      numericality: true
    },
    heartRate: {
      numericality: true
    },
    respiratoryRate: {
      numericality: true
    }
  }
});
