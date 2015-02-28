import AbstractModel from 'hospitalrun/models/abstract';
import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';
import PatientValidation from 'hospitalrun/utils/patient-validation';

export default AbstractModel.extend(NumberFormat,{
    externalInvoiceNumber: DS.attr('string'),
    patient: DS.belongsTo('patient'),
    patientInfo: DS.attr('string'), //Needed for searching
    visit: DS.belongsTo('visit'),
    status: DS.attr('string'),
    billDate: DS.attr('date'),
    paidTotal: DS.attr('number'),
    paidFlag: DS.attr('boolean', {defaultValue: false}),
    patientResponsibility: DS.attr('number'),
    paymentProfile: DS.belongsTo('price-profile'),
    /*payments track the number of payment events attached to an invoice.*/
    payments: DS.hasMany('payment'),
    /*the individual line items of the invoice*/
    lineItems: DS.hasMany('billing-line-item'),
    
        
    addPayment: function(payment) {
        var payments = this.get('payments');
        payments.addObject(payment);
        this.paymentAmountChanged();
    },
    
    discount: function() {
        return this._calculateTotal('lineItems','discount');
    }.property('lineItems.@each.discount'),
    
    nationalInsurance: function() {
        return this._calculateTotal('lineItems','nationalInsurance');
    }.property('lineItems.@each.nationalInsurance'),
        
    remainingBalance: function() {
        var patientResponsibility = this.get('patientResponsibility'),
            paidTotal = this.get('paidTotal');
        return this._numberFormat(patientResponsibility - paidTotal);
    }.property('patientResponsibility','paidTotal'),    
    
    privateInsurance: function() {
        return this._calculateTotal('lineItems','privateInsurance');
    }.property('lineItems.@each.privateInsurance'),
    
    total: function() {
        return this._calculateTotal('lineItems','total');
    }.property('lineItems.@each.total'),
    
    displayInvoiceNumber: function() {
        var externalInvoiceNumber = this.get('externalInvoiceNumber'),
            id = this.get('id');
        if (Ember.isEmpty(externalInvoiceNumber)) {
            return id;
        } else {
            return externalInvoiceNumber;
        }
    }.property('externalInvoiceNumber','id'),
    
    lineItemsByCategory: function() {
        var lineItems = this.get('lineItems'),
            byCategory = [];
        lineItems.forEach(function(lineItem) {
            var category = lineItem.get('category'),
                categoryList = byCategory.findBy('category', category);
            if (Ember.isEmpty(categoryList)) {
                categoryList = {
                    category: category,
                    items: [],
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
            var patientDisplayName = this.get('patient.displayName'),
                patientDisplayId = this.get('patient.displayPatientId');
            this.set('patientInfo', '%@ - %@'.fmt(patientDisplayName, patientDisplayId));
        }
    }.observes('patient.displayName', 'patient.id', 'patient.displayPatientId'),
    
    patientResponsibilityChanged: function() {
        var patientResponsibility = this._calculateTotal('lineItems','amountOwed');
        this.set('patientResponsibility', patientResponsibility);
    }.observes('lineItems.@each.amountOwed'),
    
    paymentAmountChanged: function() {
        var payments = this.get('payments'),
            paidTotal = payments.reduce(function(previousValue, payment) {
                return previousValue += this._getValidNumber(payment.get('amount'));
            }.bind(this),0);
        this.set('paidTotal', this._numberFormat(paidTotal,true));
        var remainingBalance = this.get('remainingBalance');
        if (remainingBalance <= 0) {
            this.set('paidFlag', true);
        }
    }.observes('payments.[]','payments.@each.amount'),
        
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
