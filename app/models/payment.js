import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    amount: DS.attr('number'),
    paymentType: DS.attr('string'),
    notes: DS.attr('string')
});
