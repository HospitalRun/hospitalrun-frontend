import AbstractModel from "hospitalrun/models/abstract";
import LocationName from "hospitalrun/mixins/location-name";
/**
 * Model to represent the location(s) of inventory items.
 * File/model name is inv-location because using inv-location will cause location
 * items to be shown as inventory items since the pouchdb adapter does a 
 * retrieve for keys starting with 'inventory' to fetch inventory items.
 */ 
var InventoryLocation = AbstractModel.extend(LocationName, {
    quantity: DS.attr('number'),
    location: DS.attr('string'),
    aisleLocation: DS.attr('string'),
    
    locationName: function() {
        var aisleLocation =  this.get('aisleLocation'),
            location = this.get('location'),
            locationName = this.formatLocationName(location, aisleLocation);
        if (Ember.isEmpty(locationName)) {
            locationName = 'No Location';
        }
        return locationName;
    }.property('location', 'aisleLocation'),

    locationNameWithQuantity: function() {
        var quantity = this.get('quantity'),
            locationName = this.get('locationName');
        return '%@ (%@ available)'.fmt(locationName, quantity);
    }.property('locationName'),
    
    validations: {
        adjustmentQuantity: {
            numericality: {
                greaterThan: 0
            },            
            acceptance: {
                /***
                 * Validate that the adjustment quantity is a number and that if a deduction there are enough items to deduct
                 */
                accept: true,
                if: function(object) {
                    var adjustmentQuantity = object.get('adjustmentQuantity'),
                        transactionType = object.get('transactionType'),
                        locationQuantity = object.get('quantity');
                    if (Ember.isEmpty(adjustmentQuantity)|| isNaN(adjustmentQuantity)) { 
                        return true;
                    }
                    if (transactionType !== 'Adjustment (Add)' && adjustmentQuantity > locationQuantity) {
                        return true;            
                    }
                    return false;
                },
                message: 'Invalid quantity'         
            }
        },        
        
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
        }
    }
});

export default InventoryLocation;