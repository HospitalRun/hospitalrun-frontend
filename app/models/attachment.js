import PhotoModel from 'hospitalrun/models/photo';
import DS from 'ember-data';

const { attr } = DS;

export default PhotoModel.extend({
  addedBy: attr('string'),
  addedByDisplayName: attr('string'),
  dateAdded: attr('date'),
  title: attr('string')
});
