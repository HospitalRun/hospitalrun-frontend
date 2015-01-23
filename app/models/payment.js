import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    paymentId: DS.attr(),
    invoiceId: DS.attr('string'),
    amount: DS.attr('number'),
    paymentType: DS.attr('string'),
    notes: DS.attr('string')
});
