import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  // Attributes
  name: DS.attr('string'),
  icd9CMCode: DS.attr('string'),
  icd10Code: DS.attr('string'),
  // Associations
  patient: DS.belongsTo('patient')
});
