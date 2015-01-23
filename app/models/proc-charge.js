import AbstractModel from 'hospitalrun/models/abstract';
/**
 * Procedure charges
 */
export default AbstractModel.extend({
    pricingItem: DS.belongsTo('pricing'),    
    quantity: DS.attr('number'),
    
    validations: {
        itemName: {
            presence: true
        },    
        
        quantity: {
            numericality: {
                greaterThan: 0,
            }
        }
    }
});