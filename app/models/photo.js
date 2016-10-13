import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';

export default AbstractModel.extend({
  _attachments: DS.attr(), // Temporarily store file as attachment until it gets uploaded to the server
  coverImage: DS.attr('boolean'),
  fileName: DS.attr('string'),
  localFile: DS.attr('boolean'),
  patient: DS.belongsTo('patient', {
    async: false
  }),
  caption: DS.attr('string'),
  url: DS.attr('string'),

  downloadImageFromServer: function(imageRecord) {
    let me = this;
    let url = imageRecord.get('url');
    let xhr = new XMLHttpRequest();
    if (!Ember.isEmpty(url)) {
      // Make sure directory exists or is created before downloading.
      this.getPatientDirectory(imageRecord.get('patientId'));
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';
      xhr.onload = function() {
        let file = new Blob([xhr.response]);
        me.addImageToFileStore(file, null, imageRecord);
      };
      xhr.send();
    }
  }
});
