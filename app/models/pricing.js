import AbstractModel from 'hospitalrun/models/abstract';

export default AbstractModel.extend({
    name: DS.attr('string'),
    category: DS.attr('string'),
    price: DS.attr('number'),
    
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