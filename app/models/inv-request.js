import AbstractModel from "hospitalrun/models/abstract";
/**
 * Model to represent a request for inventory items.
 */ 
var InventoryRequest = AbstractModel.extend({
    inventoryItem: DS.belongsTo('inventory'),
    status: DS.attr('string'),
    quantity: DS.attr('number'),
    dateRequested: DS.attr('date'),
    requestedBy: DS.attr('string'),
    batch: DS.belongsTo('inv-batch'),
    costPerUnit: DS.attr('number'),  
    quantityAtFulfillment: DS.attr('number'),    
    validations: {
        inventoryItem: {
            presence: true
        },
        quantity: {
            numericality: true
        }
    }
});

export default InventoryRequest;