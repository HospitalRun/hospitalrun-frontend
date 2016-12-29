import AbstractModel from 'hospitalrun/models/abstract';
import DateFormat from 'hospitalrun/mixins/date-format';
import DS from 'ember-data';
import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';
import PatientValidation from 'hospitalrun/utils/patient-validation';

const { computed, get, set } = Ember;

export default AbstractModel.extend(DateFormat, NumberFormat, {
  // Attributes
  externalInvoiceNumber: DS.attr('string'),
  patientInfo: DS.attr('string'), // Needed for searching
  status: DS.attr('string'),
  remarks: DS.attr('string'),
  billDate: DS.attr('date'),
  paidTotal: DS.attr('number'),

  // Associations
  patient: DS.belongsTo('patient', { async: false }),
  visit: DS.belongsTo('visit', { async: false }),
  paymentProfile: DS.belongsTo('price-profile', { async: false }),
  // payments track the number of payment events attached to an invoice.
  payments: DS.hasMany('payment', { async: false }),
  // the individual line items of the invoice
  lineItems: DS.hasMany('billing-line-item', { async: false }),

  addPayment(payment) {
    let payments = this.get('payments');
    payments.addObject(payment);
    this.paymentAmountChanged();
  },

  billDateAsTime: computed('billDate', function() {
    return this.dateToTime(get(this, 'billDate'));
  }),

  discountTotals: Ember.computed.mapBy('lineItemsByCategory', 'discount'),
  discount: Ember.computed.sum('discountTotals'),

  nationalInsuranceTotals: Ember.computed.mapBy('lineItemsByCategory', 'nationalInsurance'),
  nationalInsurance: Ember.computed.sum('nationalInsuranceTotals'),

  paidFlag: computed(function() {
    return get(this, 'status') === 'Paid';
  }),

  remainingBalance: computed('patientResponsibility', 'paidTotal', function() {
    let patientResponsibility = get(this, 'patientResponsibility');
    let paidTotal = get(this, 'paidTotal');
    return this._numberFormat((patientResponsibility - paidTotal), true);
  }),

  privateInsuranceTotals: Ember.computed.mapBy('lineItemsByCategory', 'privateInsurance'),
  privateInsurance: Ember.computed.sum('privateInsuranceTotals'),

  lineTotals: Ember.computed.mapBy('lineItems', 'total'),
  total: Ember.computed.sum('lineTotals'),

  displayInvoiceNumber: computed('externalInvoiceNumber', 'id', function() {
    let externalInvoiceNumber = get(this, 'externalInvoiceNumber');
    let id = get(this, 'id');
    return Ember.isEmpty(externalInvoiceNumber) ? id : externalInvoiceNumber;
  }),

  lineItemsByCategory: computed('lineItems.@each.amountOwed', function() {
    let lineItems = get(this, 'lineItems');
    let byCategory = [];
    lineItems.forEach(function(lineItem) {
      let category = lineItem.get('category');
      let categoryList = byCategory.findBy('category', category);
      if (Ember.isEmpty(categoryList)) {
        categoryList = {
          category,
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
  }),

  patientIdChanged: function() {
    if (!Ember.isEmpty(get(this, 'patient'))) {
      let patientDisplayName = get(this, 'patient.displayName');
      let patientDisplayId = get(this, 'patient.displayPatientId');
      set(this, 'patientInfo', `${patientDisplayName} - ${patientDisplayId}`);
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
    set(this, 'paidTotal', this._numberFormat(paidTotal, true));
    let remainingBalance = get(this, 'remainingBalance');
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
