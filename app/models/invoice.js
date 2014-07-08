import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    invoiceId: DS.attr('string'),
    invoiceNumber: DS.attr('number'),
    patientId: DS.attr('string'),
    publishStatus: DS.attr('string'),
    publishDate: DS.attr('date'),
    priceTotal: DS.attr('number'),
    paidTotal: DS.attr('number'),
    paidStatus: DS.attr('boolean', {defaultValue: false}),
    paymentProfile: DS.attr('string'),
    payments: [],
    billableEvents: [],
    lineItems: [],
    validations: {
        invoiceNumber: {
            numericality: true
        },
        priceTotal: {
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
