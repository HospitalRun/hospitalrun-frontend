import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
export default AbstractPagedController.extend({
  addPermission: 'add_invoice',
  deletePermission: 'delete_invoice',
  isCashier: function() {
    return this.currentUserRole() === 'Cashier';
  }.property(),
  canAddPayment: function() {
    return this.currentUserCan('add_payment');
  }.property(),
  startKey: [],
  queryParams: ['startKey', 'status'],
  actions: {
    printInvoice(invoice) {
      this.transitionToRoute('print.invoice', invoice);
    },
    reviewInvoice(invoice) {
      this.transitionToRoute('invoices.review', invoice);
    }
  }
});
