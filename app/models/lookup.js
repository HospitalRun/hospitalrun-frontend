import { Model } from 'ember-pouch';
import DS from 'ember-data';
export default Model.extend({
  _attachments: DS.attr(), // Temporarily store file as attachment until it gets uploaded to the server
  importFile: DS.attr('boolean', { defaultValue: false }),
  value: DS.attr(''),
  organizeByType: DS.attr('boolean'),
  userCanAdd: DS.attr('boolean')
});
