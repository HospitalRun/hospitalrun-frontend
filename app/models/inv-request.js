import AbstractModel from "hospitalrun/models/abstract";
/**
 * Model to represent a request for inventory items.
 */ 
var InventoryRequest = AbstractModel.extend({
    inventoryItem: DS.belongsTo('inventory', { async: true }),
    status: DS.attr('string'),
    quantity: DS.attr('number'),
    completedBy: DS.attr('string'),
    dateCompleted: DS.attr('date'),
    dateRequested: DS.attr('date'),
    requestedBy: DS.attr('string'),
    purchases: DS.hasMany('inv-purchase', { async: true }),
    costPerUnit: DS.attr('number'),  
    quantityAtCompletion: DS.attr('number'),
    transactionType: DS.attr('string'),
    deliveryLocation: DS.attr('string'),
    expenseAccount: DS.attr('string'),
    validations: {
        inventoryItemTypeAhead: {
            acceptance: {
                accept: true,
                if: function(object) {
                    if (!object.get('isDirty')) {
                        return false;
                    }
                    var itemName = object.get('inventoryItem.name'),
                        itemTypeAhead = object.get('inventoryItemTypeAhead');
                    if (Ember.isEmpty(itemName) || Ember.isEmpty(itemTypeAhead)) {
                        //force validation to fail
                        return true;
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
     * Fulfill the request, decrementing from the purchases available on the inventory item
     * This function doesn't save anything, it just updates the objects in memory, so 
     * a route will need to ensure that the models affected here get updated.
     * @param {boolean} increment if the request should increment, not decrement
     * @returns true if the request is fulfilled; false if it cannot be fulfilled due to a lack
     * of stock.
     */
    fulfillRequest: function(increment) {
        return new Ember.RSVP.Promise(function(resolve, reject){
            var item = this.get('inventoryItem'),
                purchases = item.get('purchases'),
                promises = [],
                quantityOnHand = item.get('quantity'),
                quantityRequested = this.get('quantity'),
                requestPurchases = this.get('purchases');
            
            if (increment || quantityOnHand >= quantityRequested) {
                promises.push(item, requestPurchases);
                Ember.RSVP.all(promises,'All fetching done for inventory fulfillment').then(function(){
                    var findResult = this.findQuantity(purchases, item, requestPurchases, increment);
                    if (findResult === true) {
                        resolve();
                    } else {
                        reject(findResult);
                    }
                }.bind(this));
            } else {
                reject('The quantity on hand, %@ is less than the requested quantity of %@.'.fmt(quantityOnHand,quantityRequested));
            }
        }.bind(this));
    },

    findQuantity: function(purchases, item, requestPurchases, increment) {
        var currentQuantity,
            costPerUnit,
            quantityOnHand = item.get('quantity'),
            quantityRequested = this.get('quantity'),
            quantityNeeded = quantityRequested,
            totalCost = 0;
        
        var foundQuantity = purchases.any(function(purchase) {
            currentQuantity = purchase.get('currentQuantity');
            if (purchase.get('expired') || currentQuantity <= 0) {
                return false;
            }
            costPerUnit = purchase.get('costPerUnit');
            if (increment) {
                purchase.incrementProperty('currentQuantity', quantityRequested);
                totalCost += (costPerUnit * currentQuantity);
                return true;
            } else {
                if (quantityNeeded > currentQuantity) {
                    totalCost += (costPerUnit * currentQuantity);
                    quantityNeeded = quantityNeeded - currentQuantity;
                    currentQuantity = 0;
                } else {
                    totalCost += (costPerUnit * quantityNeeded);
                    currentQuantity = currentQuantity - quantityNeeded;
                    quantityNeeded = 0;
                }
                purchase.set('currentQuantity',currentQuantity);
                requestPurchases.addObject(purchase);
                return (quantityNeeded === 0);
            }
        });
        if (!foundQuantity) {
            return 'Could not find any purchases that had the required quantity:'+quantityRequested;
        }
        this.set('costPerUnit', (totalCost/quantityRequested).toFixed(2));
        this.set('quantityAtCompletion', quantityOnHand);
        this.set('status','Completed');
        this.set('completedBy', this.getUserName());
        item.get('content').updateQuantity();
        return true;
    }
});

export default InventoryRequest;