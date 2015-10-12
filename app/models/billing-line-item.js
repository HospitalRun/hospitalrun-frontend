import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';

export default AbstractModel.extend(NumberFormat, {
  amountOwed: DS.attr('number'),
  category: DS.attr('string'),
  description: DS.attr('string'),
  details: DS.hasMany('line-item-detail', {
    async: false
  }), /* The individual objects that make up this line item. */
  discount: DS.attr('number'),
  name: DS.attr('string'),
  nationalInsurance: DS.attr('number'),
  privateInsurance: DS.attr('number'),

  amountOwedChanged: function() {
    Ember.run.debounce(this, function() {
      var discount = this._getValidNumber(this.get('discount')),
        nationalInsurance = this._getValidNumber(this.get('nationalInsurance')),
        privateInsurance = this._getValidNumber(this.get('privateInsurance')),
        amountOwed = this._getValidNumber(this.get('total'));
      amountOwed = amountOwed - discount - nationalInsurance - privateInsurance;
      if (amountOwed < 0) {
        amountOwed = 0;
      }
      this.set('amountOwed', this._numberFormat(amountOwed, true));
    }, 500);
  }.observes('discount', 'nationalInsurance', 'privateInsurance', 'total'),

  detailTotals: Ember.computed.mapBy('details', 'amountOwed'),
  total: Ember.computed.sum('detailTotals'),

  validations: {
    category: {
      presence: true
    },
    discount: {
      numericality: {
        allowBlank: true
      }
    },
    nationalInsurance: {
      numericality: {
        allowBlank: true
      }
    },
    name: {
      presence: true
    },
    privateInsurance: {
      numericality: {
        allowBlank: true
      }
    },
    total: {
      numericality: {
        allowBlank: true
      }
    }
  }
});
