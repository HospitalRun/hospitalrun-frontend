import { get, computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

const { attr, belongsTo } = DS;

export default AbstractModel.extend({
  // Attributes
  /* Temporarily store file as attachment until it gets uploaded to the server */
  caption: attr('string'),
  coverImage: attr('boolean'),
  files: attr('attachments', {
    defaultValue() {
      return [];
    }
  }),
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
