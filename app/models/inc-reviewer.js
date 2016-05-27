import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  addedBy: DS.attr('string'),
  dateRecorded: DS.attr('date'),
  reviewerEmail: DS.attr('string'),
  reviewerName: DS.attr('string'),
  incident: DS.belongsTo('incident', {
    async: false
  }),
  notificationSend: DS.attr('boolean', { defaultValue: false })
});
