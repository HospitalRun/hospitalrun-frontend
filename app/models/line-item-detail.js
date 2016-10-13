import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import NumberFormat from 'hospitalrun/mixins/number-format';

export default AbstractModel.extend(NumberFormat, {
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
    let price = this.get('price');
    let quantity = this.get('quantity');
    let total = 0;
    if (this._validNumber(price) && this._validNumber(quantity)) {
      total = this._numberFormat((price * quantity), true);
    }
    return total;
  }.property('price', 'quantity')

});
