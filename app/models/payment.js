import AbstractModel from 'hospitalrun/models/abstract';
import DS from 'ember-data';

export default AbstractModel.extend({
  amount: DS.attr('number'),
  charityPatient: DS.attr('boolean'), // Is patient a charity case
  expenseAccount: DS.attr('string'),
  invoice: DS.belongsTo('invoice', {
    async: false
  }),
  datePaid: DS.attr('date'),
  paymentType: DS.attr('string'),
  notes: DS.attr('string'),

  canRemovePayment: function() {
    return (this.get('paymentType') === 'Deposit');
  }.property('paymentType'),

  validations: {
    amount: {
      numericality: true
    },
    datePaid: {
      presence: true
    }
  }
});
