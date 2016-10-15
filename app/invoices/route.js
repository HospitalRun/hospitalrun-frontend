import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';

export default AbstractModuleRoute.extend(ModalHelper, PatientListRoute, {
  addCapability: 'add_invoice',
  currentScreenTitle: 'Invoices',
  editTitle: 'Edit Invoice',
  newTitle: 'New Invoice',
  moduleName: 'invoices',
  newButtonText: '+ new invoice',
  sectionTitle: 'Invoices',

  additionalButtons: function() {
    if (this.currentUserCan('add_payment')) {
      return [{
        class: 'btn btn-default',
        buttonText: '+ add deposit',
        buttonAction: 'showAddDeposit'
      }];
    }
  }.property(),

  additionalModels: [{
    name: 'billingCategoryList',
    findArgs: ['lookup', 'billing_categories']
  }, {
    name: 'expenseAccountList',
    findArgs: ['lookup', 'expense_account_list']
  }, {
    name: 'pricingProfiles',
    findArgs: ['price-profile']
  }],

  actions: {
    showAddDeposit: function() {
      let payment = this.store.createRecord('payment', {
        paymentType: 'Deposit',
        datePaid: new Date()
      });
      this.send('openModal', 'invoices.payment', payment);
    },

    showAddPayment: function(invoice) {
      let payment = this.store.createRecord('payment', {
        invoice: invoice,
        paymentType: 'Payment',
        datePaid: new Date()
      });
      this.send('openModal', 'invoices.payment', payment);
    },

    showEditPayment: function(payment) {
      if (this.currentUserCan('add_payment')) {
        this.send('openModal', 'invoices.payment', payment);
      }
    }
  },

  subActions: function() {
    let actions = [{
      text: 'Billed',
      linkTo: 'invoices.index',
      statusQuery: 'Billed'
    }];
    if (this.currentUserCan('add_invoice')) {
      actions.push({
        text: 'Drafts',
        linkTo: 'invoices.index',
        statusQuery: 'Draft'
      });
      actions.push({
        text: 'All Invoices',
        linkTo: 'invoices.index',
        statusQuery: 'All'
      });
    }
    actions.push({
      text: 'Paid',
      linkTo: 'invoices.index',
      statusQuery: 'Paid'
    });
    return actions;
  }.property()

});
