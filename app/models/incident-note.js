import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  givenBy: DS.attr('string'),
  givenByDisplayName: DS.attr('string'),
  description: DS.attr('string'),
  dateRecorded: DS.attr('date')
});
