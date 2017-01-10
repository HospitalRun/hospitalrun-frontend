import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  // Attributes
  name: DS.attr('string'),
  capabilities: DS.attr()
});