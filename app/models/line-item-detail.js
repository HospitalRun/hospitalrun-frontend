import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';

const { computed, get } = Ember;

export default AbstractModel.extend(NumberFormat, {
  // Attributes
  department: DS.attr('string'),
  expenseAccount: DS.attr('string'),
  name: DS.attr('string'),
  price: DS.attr('number'),
  quantity: DS.attr('number'),
  total: DS.attr('number'),

  // Associations
  pricingItem: DS.belongsTo('pricing', { async: false }),

  amountOwed: computed('price', 'quantity', function() {
    let price = get(this, 'price');
    let quantity = get(this, 'quantity');
    let total = 0;
    if (this._validNumber(price) && this._validNumber(quantity)) {
      total = this._numberFormat((price * quantity), true);
    }
    return total;
  })
});
