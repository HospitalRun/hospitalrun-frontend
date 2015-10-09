function selectValuesMap (value) {
  return {
    id: value,
    value: value
  };
}

import Ember from 'ember';
export default {
  /**
   * Map an objects into a format so that selects can use object as value for select
   * @param {object} object the object to map
   * @returns {object} the mapped object
   */
  selectObjectMap: function (selectValue) {
    return Ember.Object.create({
      selectObject: selectValue
    });
  },

  // Map an array of strings to objects with id and value set to the string values
  // so that the array can be used for em-select
  selectValuesMap: selectValuesMap,

  selectValues: function (array) {
    if (Ember.isArray(array)) {
      return array.map(selectValuesMap);
    }
  }
};
