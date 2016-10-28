import DS from 'ember-data';
import EmberValidations from 'ember-validations';
import { Model } from 'ember-pouch';
export default Model.extend(EmberValidations, {
  name: DS.attr('string'),
  columns: DS.attr('number'),
  fields: DS.attr('custom-fields'),
});
