import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    amount: DS.attr('number'),
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
