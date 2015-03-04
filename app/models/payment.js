import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    amount: DS.attr('number'),
    invoice: DS.belongsTo('invoice'),
    datePaid: DS.attr('date'),
    type: DS.attr('string'),
    notes: DS.attr('string'),
    
     validations: {
        amount: {
            numericality: true
        },
        datePaid: {
            presence: true
        }
    }
});
