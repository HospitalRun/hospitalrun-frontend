import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  factorType: DS.attr('string'),
  component: DS.attr('string'),
  userValue: DS.attr('string')
});
