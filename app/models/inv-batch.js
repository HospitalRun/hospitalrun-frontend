import AbstractModel from "hospitalrun/models/abstract";
/**
 * Model to represent a batch within an inventory item.
 * File/model name is inv-batch because using inventory-batch will cause batch 
 * items to be shown as inventory items since the pouchdb adapter does a 
 * retrieve for keys starting with 'inventory' to fetch inventory items.
 */ 
var InventoryBatchItem = AbstractModel.extend({
    batchCost: DS.attr('number'), 
    batchNo: DS.attr('string'),
    dateAdded: DS.attr('date'),
    costPerUnit: DS.attr('number'),
    originalQuantity: DS.attr('number'),
    currentQuantity: DS.attr('number'),
    expirationDate: DS.attr(),
    expired: DS.attr('boolean'),
    vendor: DS.attr('string'),    
    validations: {
        batchCost: {
            numericality: true
        },
        originalQuantity: {
            numericality: true
        }
    }
});

export default InventoryBatchItem;