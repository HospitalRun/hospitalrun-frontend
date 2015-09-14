import Ember from "ember";
//NOTE!!! inventory-locations mixin is needed for fulfill-request mixin!
export default Ember.Mixin.create({
    actions: {
        doneFulfillRequest: function() {
            //Placeholder function; override if you need to know when fulfillrequest is complete.    
        },
        
        fulfillRequest: function(request, closeModal, increment, skipTransition) {
            this.performFulfillRequest(request, closeModal, increment, skipTransition);
        }
    },
    
    performFulfillRequest: function(request, closeModal, increment, skipTransition) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var markAsConsumed = request.get('markAsConsumed'),
                transactionType = request.get('transactionType');
            if (transactionType === 'Request') {
                transactionType = null; //reset the transaction type so that it gets set below.
            }
            request.get('inventoryItem').then(function(inventoryItem) {
                if (markAsConsumed) {
                    request.set('adjustPurchases', true);
                    if (Ember.isEmpty(transactionType)) {
                        request.set('transactionType', 'Fulfillment');
                    }
                    this._performFulfillment(request, inventoryItem, increment).then(function() {
                        this._finishFulfillRequest(request, inventoryItem, closeModal, increment, skipTransition);
                        resolve();
                    }.bind(this), reject);
                } else {
                    request.set('adjustPurchases', false);
                    if (Ember.isEmpty(transactionType)) {
                        request.set('transactionType', 'Transfer');
                    }
                    this._finishFulfillRequest(request, inventoryItem, closeModal, increment, skipTransition);
                    resolve();
                }
            }.bind(this), reject);
        }.bind(this));
    },
    
    /**
     * @private
     */
    _findQuantity: function(request, purchases, item, increment) {
        var currentQuantity,
            costPerUnit,
            requestPurchases = [],
            quantityOnHand = item.get('quantity'),
            quantityRequested = parseInt(request.get('quantity')),
            quantityNeeded = quantityRequested,
            purchaseInfo = [],
            totalCost = 0;
        
        var foundQuantity = purchases.any(function(purchase) {
            currentQuantity = purchase.get('currentQuantity');
            if (purchase.get('expired') || currentQuantity <= 0) {
                return false;
            }
            costPerUnit = purchase.get('costPerUnit');
            if (increment) {
                purchase.incrementProperty('currentQuantity', quantityRequested);
                totalCost += (costPerUnit * quantityNeeded);
                purchaseInfo.push({
                    id: purchase.get('id'),
                    quantity: quantityRequested
                });
                requestPurchases.addObject(purchase);
                return true;
            } else {
                if (quantityNeeded > currentQuantity) {
                    totalCost += (costPerUnit * currentQuantity);
                    quantityNeeded = quantityNeeded - currentQuantity;
                    purchaseInfo.push({
                        id: purchase.get('id'),
                        quantity: parseInt(currentQuantity)
                    });
                    currentQuantity = 0;

                } else {
                    totalCost += (costPerUnit * quantityNeeded);
                    currentQuantity = currentQuantity - quantityNeeded;
                    purchaseInfo.push({
                        id: purchase.get('id'),
                        quantity: parseInt(quantityNeeded)
                    });
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
        request.set('costPerUnit', (totalCost/quantityRequested).toFixed(2));
        request.set('quantityAtCompletion', quantityOnHand);
        request.set('purchasesAffected', purchaseInfo);
        request.set('purchases', requestPurchases); //Not saved permanently, just set here so that purchases get saved later.
        item.updateQuantity();
        return true;
    },

    /**
     * @private
     * Finish the fulfillment request.
     * @param {object} request the request to fulfill.
     * @param {object} inventoryItem the inventoryItem that should be used for fulfillment.
     * @param {boolean} closeModal if the modal should be closed.
     * @param {boolean} increment if the request should increment, not decrement
     * @param {boolean} skipTransition if the transition should not run after fulfillment.
     */
    _finishFulfillRequest: function(request, inventoryItem, closeModal, increment, skipTransition) {
        var inventoryLocations = request.get('inventoryLocations'),
            locationsAffected = [],
            markAsConsumed = request.get('markAsConsumed'),
            promises = [],
            quantity = parseInt(request.get('quantity')),
            requestPurchases = request.get('purchases');
        if (increment) {
            var locationToIncrement = inventoryLocations.get('firstObject');
            locationToIncrement.incrementProperty('quantity', quantity);
            promises.push(locationToIncrement.save());
            locationsAffected.push({
                name: locationToIncrement.get('locationName'),
                quantity: quantity
            });
        } else {
            inventoryLocations.reduce(function(quantityNeeded, location) {
                var deliveryLocation = request.get('deliveryLocation'),
                    deliveryAisle = request.get('deliveryAisle'),
                    locationQuantity = parseInt(location.get('quantity'));                
                if (quantityNeeded > 0) {
                    if (!markAsConsumed) {
                        location.set('transferAisleLocation', deliveryAisle);
                        location.set('transferLocation', deliveryLocation);                        
                    }
                    if (locationQuantity >= quantityNeeded) {
                        if (markAsConsumed) {
                            location.decrementProperty('quantity', quantityNeeded);                                
                            promises.push(location.save());
                        } else {
                            location.set('adjustmentQuantity', quantityNeeded);
                            this.transferToLocation(inventoryItem, location);                            
                        }
                        locationsAffected.push({
                            name: location.get('locationName'),
                            quantity: quantityNeeded
                        });
                        return 0;
                    } else {                                
                        if (markAsConsumed) {                            
                            location.decrementProperty('quantity', locationQuantity);                                
                            promises.push(location.save());
                        } else {
                            location.set('adjustmentQuantity', locationQuantity);
                            this.transferToLocation(inventoryItem, location);                            
                        }
                        locationsAffected.push({
                            name: location.get('locationName'),
                            quantity: locationQuantity
                        });                            
                        return (quantityNeeded - locationQuantity);
                    }
                }                
            }.bind(this), quantity);
        }
        request.set('locationsAffected', locationsAffected);
        if (markAsConsumed) {        
            requestPurchases.forEach(function(purchase) {
                promises.push(purchase.save());
            });
        }
        promises.push(inventoryItem.save());
        request.set('status','Completed');
        request.set('completedBy', request.getUserName());
        promises.push(request.save());
        Ember.RSVP.all(promises,'All saving done for inventory fulfillment').then(function(){
            this.send('doneFulfillRequest');
            if (closeModal) {
                this.send('closeModal');
            }
            if (!skipTransition) {
                this.transitionTo('inventory.index');
            }
        }.bind(this));
    },
    
    /**
     * @private
     * Fulfill the request, decrementing from the purchases available on the inventory item
     * This function doesn't save anything, it just updates the objects in memory, so 
     * a route will need to ensure that the models affected here get updated.
     * @param {object} request the request to fulfill.
     * @param {object} inventoryItem the inventoryItem that should be used for fulfillment.
     * @param {boolean} increment if the request should increment, not decrement
     * @returns true if the request is fulfilled; false if it cannot be fulfilled due to a lack
     * of stock.
     */
    _performFulfillment: function(request, inventoryItem, increment) {
        return new Ember.RSVP.Promise(function(resolve, reject){
            var purchases = inventoryItem.get('purchases'),
                quantityOnHand = inventoryItem.get('quantity'),
                quantityRequested = request.get('quantity');
            if (increment || (quantityOnHand >= quantityRequested)) {
                var findResult = this._findQuantity(request, purchases, inventoryItem, increment);
                if (findResult === true) {
                    resolve();
                } else {
                    reject(findResult);
                }
            } else {
                reject('The quantity on hand, %@ is less than the requested quantity of %@.'.fmt(quantityOnHand,quantityRequested));
            }
        }.bind(this));
    }

});