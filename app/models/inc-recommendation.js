import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  activity: DS.attr('string'),
  responsibility: DS.attr('string'),
  startDate: DS.attr('date'),
  targetDateOfCompletion: DS.attr('date'),
  status: DS.attr('string'),
  dateRecorded: DS.attr('date')
});
