import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';

export default AbstractModel.extend(NumberFormat,{
    amountOwed: DS.attr('number'),
    department: DS.attr('string'),
    discount: DS.attr('number'),
    discountPercentage: DS.attr('number'),
    expenseAccount: DS.attr('string'),
    name: DS.attr('string'),
    price: DS.attr('number'),
    pricingItem: DS.belongsTo('pricing', {
      async: false
    }),
    quantity: DS.attr('number'),
    total: DS.attr('number'),
    
    _calculateAmountOwed: function() {
        var amountOwed,
            discount = this.get('discount'),
            total = this.get('total');
        if (this._validNumber(total)) {
            if (this._validNumber(discount)) {            
                amountOwed = this._numberFormat((total - discount), true);
            } else {
                amountOwed = this._numberFormat(total, true);
            }            
        }
        this.set('amountOwed', amountOwed);
    },
    
    _calculateTotal: function() {
        var discountPercentage = this.get('discountPercentage'),
            price = this.get('price'),
            quantity = this.get('quantity'),
            total;
        if (this._validNumber(price) && this._validNumber(quantity)) {
            total = this._numberFormat((price * quantity), true);
            if (!Ember.isEmpty(discountPercentage)) {
                var discount = this._numberFormat((discountPercentage * total), true);
                this.set('discount', discount);
            }
        }
        this.set('total', total);
    },
    
    amountOwedChanged: function() {
        Ember.run.debounce(this, this._calculateAmountOwed,150);
    }.observes('discount', 'total'),
   
    totalChanged: function() {
        Ember.run.debounce(this, this._calculateTotal,300);
    }.observes('price','quantity')

});