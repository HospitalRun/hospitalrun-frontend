import Ember from "ember";
export default Ember.Mixin.create({
    _numberFormat: function(value) {
        if (!Ember.isEmpty(value)) {            
            return value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        }
    }
});