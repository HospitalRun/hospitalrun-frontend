import AbstractModel from 'hospitalrun/models/abstract';
import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';

export default AbstractModel.extend(NumberFormat,{
    name: DS.attr('string'),
    quantity: DS.attr('number'),
    price: DS.attr('number'),
    department: DS.attr('string'),
    discount: DS.attr('number'),
    discountPercentage: DS.attr('number'),
    pricingItem: DS.belongsTo('pricing'),
    
    amountOwed: function() {
        var discount = this.get('discount'),
            total = this.get('total');
        if (this._validNumber(total)) {
            if (this._validNumber(discount)) {            
                return this._numberFormat((total - discount), true);
            } else {
                return this._numberFormat(total);
            }            
        }
    }.property('discount', 'total'),
   
    total: function() {
        var discountPercentage = this.get('discountPercentage'),
            price = this.get('price'),
            quantity = this.get('quantity');
        if (this._validNumber(price) && this._validNumber(quantity)) {
            var total = this._numberFormat((price * quantity), true);
            if (!Ember.isEmpty(discountPercentage)) {
                var discount = this._numberFormat((discountPercentage * total), true);
                this.set('discount', discount);
            }            
            return total; 
        }
    }.property('price','quantity')

});