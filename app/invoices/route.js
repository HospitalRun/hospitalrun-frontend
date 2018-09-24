import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
import { computed } from '@ember/object';
import { translationMacro as t } from 'ember-i18n';

export default AbstractModuleRoute.extend(ModalHelper, PatientListRoute, {
  addCapability: 'add_invoice',
  currentScreenTitle: t('billing.currentScreenTitle'),
  editTitle: t('billing.editInvoice'),
  newTitle: t('billing.newInvoice'),
  moduleName: 'invoices',
  newButtonText: t('billing.buttons.newInvoice'),
  sectionTitle: t('billing.invoiceTitle'),

  additionalButtons: computed(function() {
    if (this.currentUserCan('add_payment')) {
      return [{
        class: 'btn btn-default',
        buttonText: this.get('i18n').t('billing.buttons.addDeposit'),
        buttonAction: 'showAddDeposit'
      }];
    }
  }),

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
    showAddDeposit() {
      let payment = this.store.createRecord('payment', {
        paymentType: 'Deposit',
        datePaid: new Date()
      });
      this.send('openModal', 'invoices.payment', payment);
    },

    showAddPayment(invoice) {
      let payment = this.store.createRecord('payment', {
        invoice,
        paymentType: 'Payment',
        datePaid: new Date()
      });
      this.send('openModal', 'invoices.payment', payment);
    },

    showEditPayment(payment) {
      if (this.currentUserCan('add_payment')) {
        this.send('openModal', 'invoices.payment', payment);
      }
    }
  },

  subActions: computed(function() {
    let actions = [{
      text: this.get('i18n').t('billing.navigation.billed'),
      linkTo: 'invoices.index',
      statusQuery: 'Billed'
    }];
    if (this.currentUserCan('add_invoice')) {
      actions.push({
        text: this.get('i18n').t('billing.navigation.drafts'),
        linkTo: 'invoices.index',
        statusQuery: 'Draft'
      });
      actions.push({
        text: this.get('i18n').t('billing.navigation.allInvoices'),
        linkTo: 'invoices.index',
        statusQuery: 'All'
      });
    }
    if (this.currentUserCan('list_paid_invoices')) {
      actions.push({
        text: this.get('i18n').t('billing.navigation.paid'),
        linkTo: 'invoices.index',
        statusQuery: 'Paid'
      });
    }
    return actions;
  })

});
