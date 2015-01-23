import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    invoiceId: DS.attr('string'),
    invoiceNumber: DS.attr('number'),
    patient: DS.belongsTo('patient'),
    visit: DS.belongsTo('visit'),
    status: DS.attr('string'),
    publishDate: DS.attr('date'),
    originalPrice: DS.attr('number'),
    discountPrice: DS.attr('number'),
    /* rolloup stored in the object of the payments */
    paidTotal: DS.attr('number'),
    paidFlag: DS.attr('boolean', {defaultValue: false}),
    /*what do we overlay on the line items to generate the priceTotal */
    paymentProfile: DS.attr(),
    /*payments track the number of payment events attached to an invoice.*/
    payments: DS.hasMany('payment'),
    /*the individual line items of the invoice*/
    lineItems: DS.hasMany('billing-line-item'),
    validations: {
        invoiceNumber: {
            numericality: true
        },
        originalPrice: {
            numericality: {
                allowBlank: true
            }
        },
        discountPrice: {
            numericality: {
                allowBlank: true
            }
        },
        paidTotal: {
            numericality: {
                allowBlank: true
            }
        }
    }
});
