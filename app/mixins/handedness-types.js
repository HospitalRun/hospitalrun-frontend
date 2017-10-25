import Ember from 'ember';
import SelectValues from 'hospitalrun/utils/select-values';
export default Ember.Mixin.create({
  Handedness: [
    'Zurdo',
    'Diestro',
    'Ambidiestro'
  ].map(SelectValues.selectValuesMap)
});