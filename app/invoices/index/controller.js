import AbstractPagedController from 'hospitalrun/controllers/abstract-paged-controller';
import { computed } from '@ember/object';

export default AbstractPagedController.extend({
  addPermission: 'add_invoice',
  deletePermission: 'delete_invoice',
  isCashier: computed(function() {
    return this.currentUserRole() === 'Cashier';
  }),
  canAddPayment: computed(function() {
    return this.currentUserCan('add_payment');
  }),
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
