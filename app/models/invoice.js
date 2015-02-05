import AbstractModel from 'hospitalrun/models/abstract';
import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';
import PatientValidation from 'hospitalrun/utils/patient-validation';

export default AbstractModel.extend(NumberFormat,{
    externalInvoiceNumber: DS.attr('string'),
    patient: DS.belongsTo('patient'),
    visit: DS.belongsTo('visit'),
    status: DS.attr('string'),
    billDate: DS.attr('date'),
    /* rolloup stored in the object of the payments */
    paidTotal: DS.attr('number'),
    paidFlag: DS.attr('boolean', {defaultValue: false}),
    /*what do we overlay on the line items to generate the priceTotal */
    paymentProfile: DS.attr(),
    /*payments track the number of payment events attached to an invoice.*/
    payments: DS.hasMany('payment'),
    /*the individual line items of the invoice*/
    lineItems: DS.hasMany('billing-line-item'),

    amountOwed: function() {
        return this._calculateTotal('lineItems','amountOwed');
    }.property('lineItems.@each.amountOwed'),
    
    discount: function() {
        return this._calculateTotal('lineItems','discount');
    }.property('lineItems.@each.discount'),
    
    nationalInsurance: function() {
        return this._calculateTotal('lineItems','nationalInsurance');
    }.property('lineItems.@each.nationalInsurance'),
    
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
