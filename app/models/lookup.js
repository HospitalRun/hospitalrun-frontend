import { Model } from 'ember-pouch';
import DS from 'ember-data';

const { attr } = DS;

export default Model.extend({
  organizeByType: attr('boolean'),
  userCanAdd: attr('boolean'),
  value: attr('')
});
