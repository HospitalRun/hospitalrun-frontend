function selectValuesMap (value) {
  return {
    id: value,
    value: value
  };
}
import Ember from 'ember';
export default {
  // Map an array of strings to objects with id and value set to the string values
  // so that the array can be used for em-select

  selectValuesMap: selectValuesMap,

  selectValues: function (array) {
    if (Ember.isArray(array)) {
      return array.map(selectValuesMap);
    }
  }
};
