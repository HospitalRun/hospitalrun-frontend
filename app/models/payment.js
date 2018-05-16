<<<<<<< HEAD
import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';
import Ember from 'ember';

const { computed, get } = Ember;

export default AbstractModel.extend({
  // Attributes
  amount: DS.attr('number'),
  /* Is patient a charity case */
  charityPatient: DS.attr('boolean'),
  datePaid: DS.attr('date'),
  expenseAccount: DS.attr('string'),
  notes: DS.attr('string'),
  paymentType: DS.attr('string'),

  // Associations
  invoice: DS.belongsTo('invoice', { async: false }),

  canRemovePayment: computed('paymentType', function() {
    return get(this, 'paymentType') === 'Deposit';
  }),

  validations: {
    amount: {
      numericality: true
    },
    datePaid: {
      presence: true
    }
  }
});
=======
import { get, computed } from '@ember/object';
import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  // Attributes
  amount: DS.attr('number'),
  /* Is patient a charity case */
  charityPatient: DS.attr('boolean'),
  datePaid: DS.attr('date'),
  expenseAccount: DS.attr('string'),
  notes: DS.attr('string'),
  paymentType: DS.attr('string'),

  // Associations
  invoice: DS.belongsTo('invoice', { async: false }),

  canRemovePayment: computed('paymentType', function() {
    return get(this, 'paymentType') === 'Deposit';
  }),

  validations: {
    amount: {
      numericality: true
    },
    datePaid: {
      presence: true
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
