import AbstractModel from 'hospitalrun/models/abstract';
import DateFormat from 'hospitalrun/mixins/date-format';
import DS from 'ember-data';
import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';
import PatientValidation from 'hospitalrun/utils/patient-validation';

export default AbstractModel.extend(DateFormat, NumberFormat, {
  externalInvoiceNumber: DS.attr('string'),
  patient: DS.belongsTo('patient', {
    async: false
  }),
  patientInfo: DS.attr('string'), // Needed for searching
  visit: DS.belongsTo('visit', {
    async: false
  }),
  status: DS.attr('string'),
  remarks: DS.attr('string'),
  billDate: DS.attr('date'),
  paidTotal: DS.attr('number'),
  paymentProfile: DS.belongsTo('price-profile', {
    async: false
  }),
  // payments track the number of payment events attached to an invoice.
  payments: DS.hasMany('payment', {
    async: false
  }),
  // the individual line items of the invoice
  lineItems: DS.hasMany('billing-line-item', {
    async: false
  }),

  addPayment: function(payment) {
    let payments = this.get('payments');
    payments.addObject(payment);
    this.paymentAmountChanged();
  },

  billDateAsTime: function() {
    return this.dateToTime(this.get('billDate'));
  }.property('billDate'),

  discountTotals: Ember.computed.mapBy('lineItemsByCategory', 'discount'),
  discount: Ember.computed.sum('discountTotals'),

  nationalInsuranceTotals: Ember.computed.mapBy('lineItemsByCategory', 'nationalInsurance'),
  nationalInsurance: Ember.computed.sum('nationalInsuranceTotals'),

  paidFlag: function() {
    return (this.get('status') === 'Paid');
  }.property('status'),

  remainingBalance: function() {
    let patientResponsibility = this.get('patientResponsibility');
    let paidTotal = this.get('paidTotal');
    return this._numberFormat((patientResponsibility - paidTotal), true);
  }.property('patientResponsibility', 'paidTotal'),

  privateInsuranceTotals: Ember.computed.mapBy('lineItemsByCategory', 'privateInsurance'),
  privateInsurance: Ember.computed.sum('privateInsuranceTotals'),

  lineTotals: Ember.computed.mapBy('lineItems', 'total'),
  total: Ember.computed.sum('lineTotals'),

  displayInvoiceNumber: function() {
    let externalInvoiceNumber = this.get('externalInvoiceNumber');
    let id = this.get('id');
    if (Ember.isEmpty(externalInvoiceNumber)) {
      return id;
    } else {
      return externalInvoiceNumber;
    }
  }.property('externalInvoiceNumber', 'id'),

  lineItemsByCategory: function() {
    let lineItems = this.get('lineItems');
    let byCategory = [];
    lineItems.forEach(function(lineItem) {
      let category = lineItem.get('category');
      let categoryList = byCategory.findBy('category', category);
      if (Ember.isEmpty(categoryList)) {
        categoryList = {
          category: category,
          items: []
        };
        byCategory.push(categoryList);
      }
      categoryList.items.push(lineItem);
    }.bind(this));
    byCategory.forEach(function(categoryList) {
      categoryList.amountOwed = this._calculateTotal(categoryList.items, 'amountOwed');
      categoryList.discount = this._calculateTotal(categoryList.items, 'discount');
      categoryList.nationalInsurance = this._calculateTotal(categoryList.items, 'nationalInsurance');
      categoryList.privateInsurance = this._calculateTotal(categoryList.items, 'privateInsurance');
      categoryList.total = this._calculateTotal(categoryList.items, 'total');
    }.bind(this));
    return byCategory;
  }.property('lineItems.@each.amountOwed'),
  patientIdChanged: function() {
    if (!Ember.isEmpty(this.get('patient'))) {
      let patientDisplayName = this.get('patient.displayName');
      let patientDisplayId = this.get('patient.displayPatientId');
      this.set('patientInfo', `${patientDisplayName} - ${patientDisplayId}`);
    }
  }.observes('patient.displayName', 'patient.id', 'patient.displayPatientId'),

  patientResponsibilityTotals: Ember.computed.mapBy('lineItems', 'amountOwed'),
  patientResponsibility: Ember.computed.sum('patientResponsibilityTotals'),

  paymentAmountChanged: function() {
    let payments = this.get('payments').filter(function(payment) {
      return !payment.get('isNew');
    });
    if (payments.length === 0) {
      return;
    }
    let paidTotal = payments.reduce(function(previousValue, payment) {
        return previousValue += this._getValidNumber(payment.get('amount'));
      }.bind(this), 0);
    this.set('paidTotal', this._numberFormat(paidTotal, true));
    let remainingBalance = this.get('remainingBalance');
    if (remainingBalance <= 0) {
      this.set('status', 'Paid');
    }
  }.observes('payments.[]', 'payments.@each.amount'),

  validations: {
    patientTypeAhead: PatientValidation.patientTypeAhead,

    patient: {
      presence: true
    },

    visit: {
      presence: true
    }
  }
});
