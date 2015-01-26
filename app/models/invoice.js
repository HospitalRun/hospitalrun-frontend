import AbstractModel from 'hospitalrun/models/abstract';
import Ember from 'ember';
import PatientValidation from 'hospitalrun/utils/patient-validation';

export default AbstractModel.extend({
    externalInvoiceNumber: DS.attr('string'),
    patient: DS.belongsTo('patient'),
    visit: DS.belongsTo('visit'),
    status: DS.attr('string'),
    billDate: DS.attr('date'),
    originalTotal: DS.attr('number'),
    discountTotal: DS.attr('number'),
    /* rolloup stored in the object of the payments */
    paidTotal: DS.attr('number'),
    paidFlag: DS.attr('boolean', {defaultValue: false}),
    /*what do we overlay on the line items to generate the priceTotal */
    paymentProfile: DS.attr(),
    /*payments track the number of payment events attached to an invoice.*/
    payments: DS.hasMany('payment'),
    /*the individual line items of the invoice*/
    lineItems: DS.hasMany('billing-line-item'),
    
    displayInvoiceNumber: function() {
        var externalInvoiceNumber = this.get('externalInvoiceNumber'),
            id = this.get('id');
        if (Ember.isEmpty(externalInvoiceNumber)) {
            return id;
        } else {
            return externalInvoiceNumber;
        }
    }.property('externalInvoiceNumber','id'),
    
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
