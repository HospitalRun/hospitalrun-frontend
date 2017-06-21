import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  incidentCategoryName: DS.attr('string'),
  incidentCategoryItems: DS.attr()

});
