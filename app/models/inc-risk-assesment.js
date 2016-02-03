import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  severity: DS.attr('string'),
  occurence: DS.attr('string'),
  riskScore: DS.attr('string')
});
