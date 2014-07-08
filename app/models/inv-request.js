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
        inventoryItemTypeAhead: {
            acceptance: {
                accept: true,
                if: function(object) {
                        var item = object.get('inventoryItem'),
                            itemTypeAhead = object.get('inventoryItemTypeAhead');
                
                        if (Ember.isEmpty(item) || Ember.isEmpty(itemTypeAhead)) {
                            //force validation to fail
                            return true;
                        } else if ('%@ (%@ available)'.fmt(item.get('name'), item.get('quantity')) !== itemTypeAhead) {
                            return true;
                        } else {
                            //Diagnosis is properly set; don't do any further validation
                            return false;
                        }
                }, 
                message: 'Please select a valid inventory item'
            }
        },
        quantity: {
            numericality: true
        }
    }
});

export default InventoryRequest;