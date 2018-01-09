import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';

const { attr, belongsTo } = DS;

const { computed, get, isEmpty } = Ember;

export default AbstractModel.extend({
  // Attributes
  /* Temporarily store file as attachment until it gets uploaded to the server */
  caption: attr('string'),
  uploadDate: attr('date'),
  coverImage: attr('boolean'),
  files: attr('attachments', {
    defaultValue() {
      return [];
    }
  }),
  /*
  createdAt: DS.attr('string', {
    defaultValue() {
      return new Date();
    }
  }),
  createdMonth: Ember.computed('createdAt', function() {
    return this.get('createdAt').getMonth() + 1; // returns 2 for the current month (February)
  }),
  */
  fileName: attr('string'),
  isImage: DS.attr('boolean', { defaultValue: false }),
  localFile: DS.attr('boolean', { defaultValue: false }),
  url: attr('string'),

  // Associations
  patient: belongsTo('patient', { async: false }),
  visit: belongsTo('visit', { async: false }),
  procedure: belongsTo('procedure', { async: false }),

  shortFileName: computed('fileName', function() {
    let fileName = get(this, 'fileName');
    if (!isEmpty(fileName)) {
      fileName = fileName.substr(fileName.lastIndexOf('/') + 1);
    }
    return fileName;
  })
});
