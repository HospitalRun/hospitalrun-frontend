import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  _attachments: DS.attr(), // Temporarily store file as attachment until it gets uploaded to the server
  coverImage: DS.attr('boolean'),
  fileName: DS.attr('string'),
  localFile: DS.attr('boolean'),
  patient: DS.belongsTo('patient', {
    async: false
  }),
  caption: DS.attr('string'),
  url: DS.attr('string')
});
