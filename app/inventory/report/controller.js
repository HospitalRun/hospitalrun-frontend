export default Ember.ArrayController.extend({
    
    reportRows: function() {
        return new Ember.RSVP.Promise(function(resolve){
            var effectiveDate = this.getWithDefault('effectiveDate', new Date()),
                inventoryItems = this.get('inventoryItems'),
                inventoryRequests = this.get('model').filter(function(item) {
                    var dateCompleted = moment(item.get('dateCompleted'));
                    return (dateCompleted.isSame(effectiveDate, 'day') || dateCompleted.isBefore(effectiveDate, 'day'));
                }),
                returnRows = [],
                requestPromises = [];
                inventoryRequests.forEach(function(request) {
                    requestPromises.push(new Ember.RSVP.Promise(function(resolve, reject){
                        request.get('inventoryItem').then(function(inventoryItem) {
                            var requestItem = inventoryItems.findBy('id', inventoryItem.get('id'));
                                
                            if (!Ember.isEmpty(requestItem)) {
                                var itemRequests = requestItem.getWithDefault('requests', []);
                                itemRequests.push(request);
                            }
                            request.get('inventoryLocations').then(resolve);
                        }, reject);
                    }));
                });
                //SORT REQUESTS
                inventoryRequests.sort(function(firstRequest, secondRequest) {
                    var firstDate= firstRequest.get('dateCompleted'),
                        secondDate = secondRequest.get('dateCompleted');
                    return Ember.compare(firstDate.getTime(), secondDate.getTime());
                });
                Ember.RSVP.all(requestPromises,'All inventory requests matched to inventory items').then(function(){
                    //Loop through each itinerary item, looking at the requests and purchases to determine
                    //state of inventory at effective date
                    inventoryItems.forEach(function(item) {
                        var inventoryRequests = item.get('requests'),
                            inventoryPurchases = item.get('purchases'),
                            row = {
                                inventoryItem: item,
                                quantityInStock: 0,
                                unitCost: 0,
                                totalCost: 0,
                                locations: [
                                ]
                            };

                        inventoryRequests.forEach(function(request) {
                            var adjustPurchases = request.get('adjustPurchases'),
                                costPerUnit = request.get('costPerUnit'),
                                increment = false,
                                locations = request.get('inventoryLocations'),
                                purchases = request.get('purchasesAffected'),
                                quantity = request.get('quantity'),
                                transactionType = request.get('transactionType');
                                
                                
                            increment = (transactionType === 'Adjustment (Add)');
                            if (adjustPurchases) {
                                if (!Ember.isEmpty(purchases)) {
                                    purchases.forEach(function(purchaseInfo) {
                                        var purchaseToAdjust = inventoryPurchases.findBy('id', purchaseInfo.get('id'));
                                        if (!Ember.isEmpty(purchaseToAdjust)) {
                                        }
                                    });
                                }
                                //Find purchase(s) and figure out how many to deduct 
                            }
                            
                            //Loop through locations to adjust location quantity
                            locations.forEach(function(){
                            });
                                
                                
                            switch (transactionType) {
                                case 'Transfer': {
                                    break;
                                }
                                case 'Adjustment (Add)': {
                                    if (adjustPurchases) {
                                        row.quantityInStock += quantity;
                                        row.totalCost +=  (costPerUnit * quantity);
                                    }
                                    break;
                                }
                                default: {
                                    if (adjustPurchases) {
                                        row.quantityInStock -= quantity;
                                    }
                                }
                            }
                        });
                        
                        inventoryPurchases.forEach(function(purchase) {
                            var purchaseQuantity = purchase.get('originalQuantity');
                            row.quantityInStock += purchaseQuantity;
                            row.totalCost += purchase.get('purchaseCost');
                            var locationToUpdate = row.locations.findBy('name', purchase.get('locationName'));
                            if (Ember.isEmpty(locationToUpdate)) {
                                locationToUpdate = {
                                    name: purchase.get('locationName'),
                                    quantity: purchaseQuantity 
                                };
                            } else {
                                locationToUpdate.quantity += purchaseQuantity;
                            }
                        });
                        returnRows.push(row);
                    });
                    resolve(returnRows);
                });
        }.bind(this));
    }.property('effectiveDate')
    
});