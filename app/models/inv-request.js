import AbstractModel from "hospitalrun/models/abstract";
import Ember from "ember";
import LocationName from "hospitalrun/mixins/location-name";
/**
 * Model to represent a request for inventory items.
 */ 
var InventoryRequest = AbstractModel.extend(LocationName, {
    adjustPurchases: DS.attr('boolean'),
    completedBy: DS.attr('string'),
    costPerUnit: DS.attr('number'),
    dateCompleted: DS.attr('date'),
    dateRequested: DS.attr('date'),
    deliveryAisle: DS.attr('string'),
    deliveryLocation: DS.attr('string'),
    expenseAccount: DS.attr('string'),
    inventoryItem: DS.belongsTo('inventory', { async: true }),
    locationsAffected: DS.attr(),
    markAsConsumed: DS.attr('boolean', { defaultValue:true }),
    patient: DS.belongsTo('patient'),
    purchasesAffected: DS.attr(),
    quantity: DS.attr('number'),
    quantityAtCompletion: DS.attr('number'),
    reason: DS.attr('string'),
    requestedBy: DS.attr('string'),
    status: DS.attr('string'),
    transactionType: DS.attr('string'),
    visit: DS.belongsTo('visit'),
    
    deliveryLocationName: function() {
        var aisle = this.get('deliveryAisle'), 
            location = this.get('deliveryLocation');
        return this.formatLocationName(location, aisle);
    }.property('deliveryAisle', 'deliveryLocation'),
    
    validations: {
        inventoryItemTypeAhead: {
            acceptance: {
                accept: true,
                if: function(object) {
                    if (!object.get('isDirty')) {
                        return false;
                    }
                    var itemName = object.get('inventoryItem.name'),
                        itemTypeAhead = object.get('inventoryItemTypeAhead'),
                        requestedItems = object.get('requestedItems'),
                        status = object.get('status');
                    if (status === 'Requested') {
                        //Requested items don't show the type ahead and therefore don't need validation.
                        return false;
                    }
                    if (Ember.isEmpty(itemName) || Ember.isEmpty(itemTypeAhead)) {
                        //force validation to fail if fields are empty and requested items are empty
                        return Ember.isEmpty(requestedItems);
                    } else {
                        var typeAheadName = itemTypeAhead.substr(0, itemName.length);
                        if (itemName !== typeAheadName) {
                            return true;
                        }
                    }
                    //Inventory item is properly selected; don't do any further validation
                    return false;

                }, 
                message: 'Please select a valid inventory item'
            }
        },
        quantity: {
            numericality: {
                greaterThan: 0,
                if: function(object) {
                    var requestedItems = object.get('requestedItems');
                    return (Ember.isEmpty(requestedItems));
                }
            },
            acceptance: {
                accept: true,
                if: function(object) {
                        var isNew = object.get('isNew'),
                            requestQuantity = parseInt(object.get('quantity')),
                            transactionType = object.get('transactionType'),
                            quantityToCompare = null;
                        if (transactionType === 'Return') {
                            //no validation needed for returns
                            return false;
                        } else if (isNew && transactionType === 'Request') {
                            quantityToCompare = object.get('inventoryItem.quantity');
                        } else { 
                            quantityToCompare = object.get('inventoryLocation.quantity');
                        }
                        if ( requestQuantity > quantityToCompare) {
                            //force validation to fail
                            return true;
                        } else {
                            //Diagnosis is properly set; don't do any further validation
                            return false;
                        }
                }, 
                message: 'The quantity must be less than or equal to the number of available items.'
            }
        }
    }
});

export default InventoryRequest;