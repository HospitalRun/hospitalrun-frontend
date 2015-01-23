import AbstractModel from 'hospitalrun/models/abstract';

export default AbstractModel.extend({
    inventoryItem: DS.belongsTo('inventory'),
    name: DS.attr('string'),
    quantity: DS.attr('number'),
    
    validations: {
        name: {
            presence: true
        },    
        
        quantity: {
            numericality: {
                greaterThan: 0,
            }
        }
    }
});