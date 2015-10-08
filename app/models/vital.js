import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  dateRecorded: DS.attr('date'),
  temperature: DS.attr('number'),
  weight: DS.attr('string'),
  height: DS.attr('string'),
  sbp: DS.attr('number'),
  dbp: DS.attr('number'),
  heartRate: DS.attr('number'),
  respiratoryRate: DS.attr('number'),
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
