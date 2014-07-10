import AbstractModel from "hospitalrun/models/abstract";
/**
 * Model to represent a request for inventory items.
 */ 
var InventoryRequest = AbstractModel.extend({
    inventoryItem: DS.belongsTo('inventory'),
    status: DS.attr('string'),
    quantity: DS.attr('number'),
    fulfilledBy: DS.attr('string'),
    dateFulfilled: DS.attr('date'),
    dateRequested: DS.attr('date'),
    requestedBy: DS.attr('string'),
    batches: DS.hasMany('inv-batch'),
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
            numericality: true,
            acceptance: {
                accept: true,
                if: function(object) {
                        var itemQuantity = object.get('inventoryItem.quantity'),
                            requestQuantity = parseInt(object.get('quantity'));
                        if ( requestQuantity > itemQuantity) {
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
    },

    /**
     * Fulfill the request, decrementing from the batches available on the inventory item
     * This function doesn't save anything, it just updates the objects in memory, so 
     * a route will need to ensure that the models affected here get updated.
     * @returns true if the request is fulfilled; false if it cannot be fulfilled due to a lack
     * of stock.
     */
    fulfillRequest: function() {
        var currentQuantity,
            costPerUnit,
            item = this.get('inventoryItem'),
            batches = item.get('batches'),
            quantityOnHand = item.get('quantity'),
            quantityRequested = this.get('quantity'),
            quantityNeeded = quantityRequested,
            requestBatches = this.get('batches'),
            totalCost = 0;
        if (quantityOnHand >= quantityRequested) {
            var foundQuantity = batches.any(function(batch) {
                currentQuantity = batch.get('currentQuantity');                    
                if (batch.get('expired') || currentQuantity <= 0) {
                    return false;
                }
                costPerUnit = batch.get('costPerUnit');
                if (quantityNeeded > currentQuantity) {
                    totalCost += (costPerUnit * currentQuantity);                        
                    quantityNeeded = quantityNeeded - currentQuantity; 
                    currentQuantity = 0;
                } else {                        
                    totalCost += (costPerUnit * quantityNeeded);                        
                    currentQuantity = currentQuantity - quantityNeeded;
                    quantityNeeded = 0;                        
                }
                batch.set('currentQuantity',currentQuantity);
                requestBatches.addObject(batch);
                return (quantityNeeded === 0);
            });
            if (!foundQuantity) {                
                return false;
            }
            this.set('costPerUnit', (totalCost/quantityRequested).toFixed(2));
            this.set('quantityAtFulfillment', quantityOnHand);
            this.set('status','Fulfilled');
            this.set('dateFulfilled', new Date());     
            this.set('fulfilledBy', this.getUserName());
            item.updateQuantity();
            return true;
        } else {
            return false;
        }
    }
});

export default InventoryRequest;