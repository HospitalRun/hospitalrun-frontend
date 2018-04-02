import Controller from '@ember/controller';
export default Controller.extend({
  actions: {
    returnToInvoice() {
      this.transitionTo('invoices.edit', this.get('model'));
    }
  }
});
