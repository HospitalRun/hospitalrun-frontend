import { mapBy, sum } from '@ember/object/computed';
import { debounce } from '@ember/runloop';
import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import NumberFormat from 'hospitalrun/mixins/number-format';

export default AbstractModel.extend(NumberFormat, {
  // Attributes
  amountOwed: DS.attr('number'),
  category: DS.attr('string'),
  description: DS.attr('string'),
  discount: DS.attr('number'),
  name: DS.attr('string'),
  nationalInsurance: DS.attr('number'),
  privateInsurance: DS.attr('number'),
  // Associations
  /* The individual objects that make up this line item. */
  details: DS.hasMany('line-item-detail', { async: false }),

  amountOwedChanged: function() {
    debounce(this, function() {
      let discount = this._getValidNumber(this.get('discount'));
      let nationalInsurance = this._getValidNumber(this.get('nationalInsurance'));
      let privateInsurance = this._getValidNumber(this.get('privateInsurance'));
      let amountOwed = this._getValidNumber(this.get('total'));
      amountOwed = amountOwed - discount - nationalInsurance - privateInsurance;
      if (amountOwed < 0) {
        amountOwed = 0;
      }
      if (!this.get('isDestroyed')) {
        this.set('amountOwed', this._numberFormat(amountOwed, true));
      }
    }, 500);
  }.observes('discount', 'nationalInsurance', 'privateInsurance', 'total'),

  detailTotals: mapBy('details', 'amountOwed'),
  total: sum('detailTotals'),

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
