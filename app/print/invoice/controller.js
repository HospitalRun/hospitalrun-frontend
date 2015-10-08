import Ember from 'ember';
export default Ember.ObjectController.extend({
  actions: {
    returnToInvoice: function () {
      this.transitionTo('invoices.edit', this.get('model'));
    }
  }
});
