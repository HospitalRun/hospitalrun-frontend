import Ember from 'ember';
export default Ember.Mixin.create({
  /**
   * Given an array and property, total all of the property values in the array and return the value.
   * @param array Array|String either the actual array or the property name of the array on this object.
   * @param propertyName String the property name in the array values to total.
   * @param number that contains at most two decimal places.
   */
  _calculateTotal: function(array, propertyName) {
    let arrayItems;
    let total = 0;
    if (Ember.isArray(array)) {
      arrayItems = array;
    } else {
      arrayItems = this.get(array);
    }
    total = arrayItems.reduce(function(previousValue, lineItem) {
      return previousValue += this._getValidNumber(Ember.get(lineItem, propertyName));
    }.bind(this), 0);
    return this._numberFormat(total, true);
  },

  /**
   * Determine if number passed in is actually a number.  If it is, return the number; otherwise return 0.
   * @param number the number to valdiate.
   * @returns number a valid number.
   */
  _getValidNumber: function(number) {
    if (Ember.isEmpty(number) || isNaN(number)) {
      return 0;
    } else {
      return Number(number);
    }
  },

  /**
   * Return a formatted number with a maximum of two digits
   * @param value number to format
   * @param returnAsNumber boolean to denote if formatted number should be returned
   * as a number instead of a string
   * @returns String|Number a formatted String or number containing the formatted number.
   */
  _numberFormat: function(value, returnAsNumber) {
    let returnValue;
    if (!Ember.isEmpty(value)) {
      if (isNaN(value)) {
        return;
      }
      if (Math.round(value) === value) {
        returnValue = Number(value).toString();
      } else {
        returnValue = Number(value).toFixed(2);
      }
      if (returnAsNumber) {
        return Number(returnValue);
      } else {
        return returnValue.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
      }
    }
  },

  _validNumber: function(number) {
    return (!Ember.isEmpty(number) && !isNaN(number) && number > 0);
  }

});
