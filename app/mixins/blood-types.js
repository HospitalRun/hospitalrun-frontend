import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
export default Ember.Mixin.create({
  bloodTypes: [
    'A+',
    'A-',
    'AB-',
    'AB+',
    'B+',
    'B-',
    'O+',
    'O-',
    'INRA'
  ].map(SelectValues.selectValuesMap)
});
