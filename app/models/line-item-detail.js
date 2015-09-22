import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';

export default AbstractModel.extend(NumberFormat,{
    department: DS.attr('string'),
    expenseAccount: DS.attr('string'),
    name: DS.attr('string'),
    price: DS.attr('number'),
    pricingItem: DS.belongsTo('pricing', {
      async: false
    }),
    quantity: DS.attr('number'),
    total: DS.attr('number'),
    
    amountOwed: function() {
        var price = this.get('price'),
            quantity = this.get('quantity'),
            total = 0;
        if (this._validNumber(price) && this._validNumber(quantity)) {
            total = this._numberFormat((price * quantity), true);
        }
        return total;
    }.property('price','quantity')

});