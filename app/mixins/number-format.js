import Ember from "ember";
export default Ember.Mixin.create({
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
        
    _numberFormat: function(value) {        
        if (!Ember.isEmpty(value)) {            
            return value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        }
    }
});