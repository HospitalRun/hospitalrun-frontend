import Ember from 'ember';
import NumberFormat from "hospitalrun/mixins/number-format";
export default Ember.ObjectController.extend(NumberFormat, {
    canAddCharge: function() {
        return this.parentController.get('canAddCharge');
    }.property(),
        
    detailDiscountChanged: function() {
        var discount = this.get('discount');
        if (!Ember.isEmpty(discount)) {
            this.set('discountPercentage');
        }    
    }.observes('discount')
});