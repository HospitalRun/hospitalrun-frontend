import PhotoModel from 'hospitalrun/models/photo';
import DocumentModel from 'hospitalrun/models/document';
import DS from 'ember-data';

const { attr } = DS;

export default DocumentModel.extend({
  addedBy: attr('string'),
  addedByDisplayName: attr('string'),
  dateAdded: attr('date'),
  title: attr('string')
});
PhotoModel.extend({
  addedBy: attr('string'),
  addedByDisplayName: attr('string'),
  dateAdded: attr('date'),
  title: attr('string')
});