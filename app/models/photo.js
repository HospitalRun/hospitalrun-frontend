import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  // Attributes
  /* Temporarily store file as attachment until it gets uploaded to the server */
  _attachments: DS.attr(),
  caption: DS.attr('string'),
  coverImage: DS.attr('boolean'),
  fileName: DS.attr('string'),
  localFile: DS.attr('boolean'),
  url: DS.attr('string'),

  // Associations
  patient: DS.belongsTo('patient', { async: false })
});
