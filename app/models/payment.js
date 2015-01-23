import AbstractModel from "hospitalrun/models/abstract";
import Ember from "ember";

export default AbstractModel.extend({
    paymentId: DS.attr(),
    invoiceId: DS.attr('string'),
    amount: DS.attr('number'),
    paymentType: DS.attr('string'),
    notes: DS.attr('string')
});
