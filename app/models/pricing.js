import AbstractModel from 'hospitalrun/models/abstract';

export default AbstractModel.extend({
    category: DS.attr('string'),
    expenseAccount: DS.attr('string'),
    name: DS.attr('string'),
    price: DS.attr('number'),
    type: DS.attr('string'),
    pricingOverrides: DS.hasMany('override-price'),
        
    validations: {
        category: {
            presence: true
        },
        name: {
            presence: true
        },        
        price: {
            numericality: true
        }
    }
});