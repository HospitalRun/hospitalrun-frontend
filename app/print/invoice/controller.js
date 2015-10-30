import Ember from 'ember';
export default Ember.Controller.extend({
  actions: {
    returnToInvoice: function() {
      this.transitionTo('invoices.edit', this.get('model'));
    }
  }
});
