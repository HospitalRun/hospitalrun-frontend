import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import InventoryLocations from "hospitalrun/mixins/inventory-locations";
export default AbstractModuleRoute.extend(InventoryLocations, {
    additionalModels: [{ 
        name: 'aisleLocationList',
        findArgs: ['lookup','aisle_location_list']
    }, {
        name: 'deliveryLocationList',
        findArgs: ['lookup','delivery_location_list']
    }, {
        name: 'expenseAccountList',
        findArgs: ['lookup','expense_account_list']
    }, {
        name: 'warehouseList',
        findArgs: ['lookup','warehouse_list']
    }
  ],
    
    currentItem: null,
    modelName: 'inventory',
    moduleName: 'inventory',
    newButtonAction: 'newRequest',
    newButtonText: '+ new request',
    subActions: [{
        text: 'Requests',
        linkTo: 'inventory.index'
    }, {
        text: 'Items',
        linkTo: 'inventory.listing'
    }, {
        text: 'History',
        linkTo: 'inventory.completed'
    }],
    sectionTitle: 'Inventory',
    
    actions: {
        addPurchase: function(newPurchase) {
            var currentItem = this.get('currentItem'),
                purchases = currentItem.get('purchases');
            purchases.addObject(newPurchase);
            this.newPurchaseAdded(currentItem, newPurchase); 
            currentItem.updateQuantity();
            currentItem.save();
            this.send('closeModal');
        },
        
        newRequest: function() {
            var newId = this.generateId();
            var data = this.getNewData();
            if (newId) {
                data.id = newId;
            }
            var item = this.get('store').createRecord('inv-request', {
                transactionType: 'Request'
            });            
            this.transitionTo('inventory.request', item);
        },    
        
        allItems: function() {
            this.transitionTo('inventory.listing');
        },
                
        fulfillRequest: function(request, closeModal, increment, skipTransition) {
            var markAsConsumed = request.get('markAsConsumed');
            
            if (markAsConsumed) {
                if (Ember.isEmpty(request.get('transactionType'))) {
                    request.set('transactionType', 'Fulfillment');
                }
                this.performFulfillment(request, increment).then(function() {
                    this.finishFulfillRequest(request, closeModal, increment, skipTransition);
                }.bind(this));
            } else {
                if (Ember.isEmpty(request.get('transactionType'))) {
                    request.set('transactionType', 'Transfer');
                }
                this.finishFulfillRequest(request, closeModal, increment, skipTransition);
            }
        },

        newDelivery: function() {
            var item = this.get('store').createRecord('inv-request', {
                dateCompleted: new Date(),
                transactionType: 'Delivery'
            });            
            this.transitionTo('inventory.delivery', item);
        },
        
        showAddPurchase: function(inventoryItem) {
            var newPurchase = this.get('store').createRecord('inv-purchase', {
                distributionUnit: inventoryItem.get('distributionUnit')
            });            
            this.set('currentItem', inventoryItem);
            this.send('openModal', 'inventory.purchase.edit', newPurchase);
        }        

    },
    
    /**
     * Calculate a new id based on time stamp and randomized number
     * @return a generated id in base 36 so that its a shorter barcode.
     */
    generateId: function() {
        var min = 1,
            max = 999,
            part1 = new Date().getTime(),
            part2 = Math.floor(Math.random() * (max - min + 1)) + min;
        return part1.toString(36) +'_' + part2.toString(36);
    },
    
    /**
     * Define what data a new inventory item should be instantiated with.  
     * The only default is to set the type to asset; at some point this may be driven by subsection of inventory you are in.
     * @return the default properties for a new inventory item.
     */    
    getNewData: function() {
        return  {
            type: 'Asset'
        };
    },
    
    
    /**
     * Fulfill the request, decrementing from the purchases available on the inventory item
     * This function doesn't save anything, it just updates the objects in memory, so 
     * a route will need to ensure that the models affected here get updated.
     * @param {boolean} increment if the request should increment, not decrement
     * @returns true if the request is fulfilled; false if it cannot be fulfilled due to a lack
     * of stock.
     */
    performFulfillment: function(request, increment) {
        return new Ember.RSVP.Promise(function(resolve, reject){
            var item = request.get('inventoryItem'),
                purchases = item.get('purchases'),
                quantityOnHand = item.get('quantity'),
                quantityRequested = request.get('quantity');
            if (increment || (quantityOnHand >= quantityRequested)) {
                request.get('purchases').then(function(requestPurchases){
                    var findResult = this.findQuantity(request, purchases, item, requestPurchases, increment);
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

    findQuantity: function(request, purchases, item, requestPurchases, increment) {
        var currentQuantity,
            costPerUnit,
            quantityOnHand = item.get('quantity'),
            quantityRequested = request.get('quantity'),
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
        request.set('costPerUnit', (totalCost/quantityRequested).toFixed(2));
        request.set('quantityAtCompletion', quantityOnHand);        
        item.get('content').updateQuantity();
        return true;
    },
    
    finishFulfillRequest: function(request, closeModal, increment, skipTransition) {
        var inventoryItem = request.get('inventoryItem'),            
            markAsConsumed = request.get('markAsConsumed'),
            promises = [],
            quantity = parseInt(request.get('quantity')),
            requestPurchases = request.get('purchases');
        request.get('inventoryLocations').then(function(inventoryLocations) {
            if (increment) {
                inventoryLocations.get('firstObject').incrementProperty('quantity', quantity);
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
                            return 0;
                        } else {                                
                            if (markAsConsumed) {                            
                                location.decrementProperty('quantity', locationQuantity);
                                promises.push(location.save());
                            } else {
                                location.set('adjustmentQuantity', locationQuantity);
                                this.transferToLocation(inventoryItem, location);                            
                            }
                            return (quantityNeeded - locationQuantity);
                        }
                        if (markAsConsumed) {
                            promises.push(location.save());
                        }
                    }                
                }.bind(this), quantity);
            }        
            if (markAsConsumed) {        
                requestPurchases.forEach(function(purchase) {
                    promises.push(purchase.save());
                });
            }
            promises.push(inventoryItem.get('content').save());
            request.set('status','Completed');
            request.set('completedBy', request.getUserName());
            promises.push(request.save());
            Ember.RSVP.all(promises,'All saving done for inventory fulfillment').then(function(){
                if (closeModal) {
                    this.send('closeModal');
                }
                if (!skipTransition) {
                    this.transitionTo('inventory.completed');
                }
            }.bind(this));
        }.bind(this));
    }

});