import AbstractModel from "hospitalrun/models/abstract";
/**
 * Model to represent the location(s) of inventory items.
 * File/model name is inv-location because using inv-location will cause location
 * items to be shown as inventory items since the pouchdb adapter does a 
 * retrieve for keys starting with 'inventory' to fetch inventory items.
 */ 
var InventoryLocation = AbstractModel.extend({
    quantity: DS.attr('number'),
    location: DS.attr('string'),
    aisleLocation: DS.attr('string'),
    validations: {
        transferLocation: {
            acceptance: {
                /***
                * Validate that a procedure has been specified and that it
                * is a valid procedure.
                */
                accept: true,
                if: function(object) {
                    var transferLocation = object.get('transferLocation'),
                    transferItem = object.get('transferItem');
                    //If we don't have a transfer item, then a transfer is not occurring.
                    if (!Ember.isEmpty(transferItem) && Ember.isEmpty(transferLocation)) {
                        return true;
                    }
                    return false;
                },
                message: 'Please select a location to transfer to'         
            }
        },
        transferQuantity: {
            acceptance: {
                /***
                 * Validate that a procedure has been specified and that it
                 * is a valid procedure.
                 */
                accept: true,
                if: function(object) {
                    var transferQuantity = object.get('transferQuantity'),
                    locationQuantity = object.get('quantity'),
                    transferItem = object.get('transferItem');
                    //If we don't have a transfer item, then a transfer is not occurring.
                    if (!Ember.isEmpty(transferItem) && (Ember.isEmpty(transferQuantity) || transferQuantity > locationQuantity)) {
                        return true;
                    }
                    return false;
                },
                message: 'Please select a quantity less than or equal to the number available for transfer'         
            }
        }
    }
});

export default InventoryLocation;