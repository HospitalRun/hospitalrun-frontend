<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Controller.extend({
  actions: {
    returnToInvoice() {
      this.transitionTo('invoices.edit', this.get('model'));
    }
  }
});
=======
import Controller from '@ember/controller';
export default Controller.extend({
  actions: {
    returnToInvoice() {
      this.transitionTo('invoices.edit', this.get('model'));
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
