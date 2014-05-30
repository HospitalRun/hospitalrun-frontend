import AbstractModel from "hospitalrun/models/abstract";

export default AbstractModel.extend({
    description: DS.attr('string'),
    keywords: DS.attr(),
    name: DS.attr('string'),
    quantity: DS.attr('number'),
    crossReference: DS.attr('string'),
    type: DS.attr('string'),
    price: DS.attr('number'),
    validations: {
        name: {
            presence: true,
        },
        quantity: {
            numericality: true
        },
        price: {
            numericality: {
                allowBlank: true
            }
        }
    }
});
