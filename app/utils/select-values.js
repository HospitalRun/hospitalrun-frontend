function selectValuesMap(value) {
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
  selectObjectMap: function(selectValue) {
    return Ember.Object.create({
      selectObject: selectValue
    });
  },

  selectValuesMap: selectValuesMap,

  /** Map an array of strings to objects with id and value set to the string values
   * so that the array can be used for em-select
   * @param {Array} array to map.
   * @param {boolean} includeEmpty if there should be an empty item added to the select list
   */
  selectValues: function(array, includeEmpty) {
    if (Ember.isArray(array)) {
      let arrayToMap = new Array(array);
      if (includeEmpty) {
        arrayToMap = [''];
        arrayToMap.addObjects(array);
      } else {
        arrayToMap = array;
      }
      return arrayToMap.map(selectValuesMap);
    }
  }
};
