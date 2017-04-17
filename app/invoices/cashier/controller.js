import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
export default AbstractPagedController.extend({
  addPermission: 'add_invoice',
  deletePermission: 'delete_invoice',
  canAddPayment: function() {
    return this.currentUserCan('add_payment');
  }.property(),
  startKey: [],
  queryParams: ['startKey', 'status'],

  actions: {
    printInvoice(invoice) {
      console.log(invoice);
      this.transitionToRoute('print.invoice', invoice);
    },
    reviewInvoice(invoice) {
      this.transitionToRoute('invoices.review', invoice);
    }
  }
});
