import DateSort from 'hospitalrun/utils/date-sort';
import LocationName from "hospitalrun/mixins/location-name";
export default Ember.ArrayController.extend(LocationName, {
    needs: ['inventory'],
    reportRows: [],
    reportColumns: {
        id: {
            label: 'Id',
            include: true,
            property: 'inventoryItem.friendlyId'
        }, 
        name: {
            label: 'Name',
            include: true,
            property: 'inventoryItem.name'
        }, 
        description: {
            label: 'Description',
            include: false,
            property: 'inventoryItem.description'
        },
        type: {        
            label: 'Type',
            include: true,
            property: 'inventoryItem.type'
        }, 
        xref: {
            label: 'Cross Reference',
            include: false,
            property: 'inventoryItem.crossReference'
        }, 
        reorder: {
            label: 'Reorder Point',
            include: false,
            property: 'inventoryItem.reorderPoint'
        }, 
        price: {
            label: 'Price Per Unit',
            include: false,
            property: 'inventoryItem.price'
        }, 
        unit: {
            label: 'Distribution Unit', 
            include: true,
            property: 'inventoryItem.distributionUnit'
        }, 
        quantity: {
            label: 'Quantity', 
            include: true,
            property: 'quantityInStock'
        },
        gift: {
            label: 'Gift In Kind',
            include: true,
            property: 'giftInKind'
        },
        locations: {
            label: 'Locations',
            include: true,
            property: 'locations'
        }
    },
    
    inventoryItems: Ember.computed.alias('controllers.inventory.model'),
    showReportResults: false,
    
    _addReportRow: function(row) {
        var locations, 
            locationDetails = '',
            reportColumns = this.get('reportColumns'),
            reportRows = this.get('reportRows'),
            reportRow = [];
        for (var column in reportColumns) {
            if (reportColumns[column].include) {
                if (reportColumns[column].property === 'locations') {
                    locations = Ember.get(row,'locations');
                    
                    for (var i=0; i< locations.length; i++) {                        
                        if (i > 0) {
                            locationDetails += '; ';
                        }
                        locationDetails += '%@ (%@ available)'.fmt(locations[i].name, locations[i].quantity);
                    }
                    reportRow.push(locationDetails);
                } else {
                    reportRow.push(Ember.get(row,reportColumns[column].property));
                }
            }
        }
        reportRows.addObject(reportRow);
    },
    
    /**
     * Adjust the specified location by the specified quantity
     * @param {array} locations the list of locations to adjust from
     * @param {string} locationName the name of the location to adjust
     * @param {integer} quantity the quantity to adjust.
     * @param {boolean} increment boolean indicating if the adjustment is an increment; or false if decrement.
     */
    _adjustLocation: function(locations, locationName, quantity, increment) {
        var locationToUpdate = locations.findBy('name', locationName);
        if (Ember.isEmpty(locationToUpdate)) {
            locationToUpdate = {
                name: locationName,
                quantity: 0
            };
            locations.push(locationToUpdate);
        }
        if (increment) {
            locationToUpdate.quantity += quantity;
        } else {
            locationToUpdate.quantity -= quantity;
        }
    },
    
    /**
     * Adjust the specified purchase by the specified quantity.
     * @param {array} purchases the list of purchases to adjust from.
     * @param {string} purchaseId the id of the purchase to adjust.
     * @param {integer} quantity the quantity to adjust.
     * @param {boolean} increment boolean indicating if the adjustment is an increment; or false if decrement.
     */
    _adjustPurchase: function(purchases, purchaseId, quantity, increment) {
        var purchaseToAdjust = purchases.findBy('id', purchaseId);
        if (!Ember.isEmpty(purchaseToAdjust)) {
            var calculatedQuantity = purchaseToAdjust.get('calculatedQuantity');
            if (increment) {
                calculatedQuantity += quantity;
            } else {
                calculatedQuantity -= quantity;
            }
            purchaseToAdjust.set('calculatedQuantity',calculatedQuantity);
        }        
    },
    
    _generateExport: function() {
        var csvRows = [],
            reportHeaders = this.get('reportHeaders'),
            dataArray = [reportHeaders];
        dataArray.addObjects(this.get('reportRows'));
        dataArray.forEach(function(row) { 
            csvRows.push(row.join(','));   // unquoted CSV row
        });
        var csvString = csvRows.join('\r\n');
        var uriContent = "data:application/csv;charset=utf-8," + encodeURIComponent(csvString);
        this.set('csvExport', uriContent);
    },
        
    _setReportHeaders: function() {
        var reportColumns = this.get('reportColumns'),
            reportHeaders = [];
        for (var column in reportColumns) {
            if (reportColumns[column].include) {
                reportHeaders.push(reportColumns[column].label);
            }
        }
        this.set('reportHeaders', reportHeaders);
    },
    
    actions: {
        generateReport: function() {
            var effectiveDate = this.getWithDefault('effectiveDate', new Date()),
                inventoryItems = this.get('inventoryItems'),
                inventoryRequests = this.get('model').filter(function(item) {
                    var dateCompleted = moment(item.get('dateCompleted'));
                    return (dateCompleted.isSame(effectiveDate, 'day') || dateCompleted.isBefore(effectiveDate, 'day'));
                }),
                reportRows = this.get('reportRows'),
                requestPromises = [];
            reportRows.clear();
            inventoryItems.forEach(function(item) {
                //Clear out requests from last time report was run.
                item.set('requests', []);
            });                
            if (!Ember.isEmpty(inventoryRequests)) {
                //SORT REQUESTS
                inventoryRequests.sort(function(firstRequest, secondRequest) {
                    return DateSort.sortByDate(firstRequest, secondRequest, 'dateCompleted');
                }.bind(this));

                //Link inventory requests to inventory items
                inventoryRequests.forEach(function(request) {
                    requestPromises.push(new Ember.RSVP.Promise(function(resolve, reject){
                        request.get('inventoryItem').then(function(inventoryItem) {
                            var requestItem = inventoryItems.findBy('id', inventoryItem.get('id'));
                            if (!Ember.isEmpty(requestItem)) {
                                var itemRequests = requestItem.get('requests');
                                itemRequests.push(request);
                                inventoryItem.set('requests', itemRequests);
                            }                        
                            resolve();
                        }, reject);
                    }));
                });
            }
            Ember.RSVP.all(requestPromises,'All inventory requests matched to inventory items').then(function(){
                //Loop through each itinerary item, looking at the requests and purchases to determine
                //state of inventory at effective date
                inventoryItems.forEach(function(item) {
                    var inventoryPurchases = item.get('purchases'),
                        inventoryRequests = item.get('requests'),
                        row = {
                            giftInKind: 'N',
                            inventoryItem: item,
                            quantityInStock: 0,
                            unitCost: 0,
                            totalCost: 0,
                            locations: [
                            ]
                        };

                    inventoryPurchases = inventoryPurchases.filter(function(purchase) {
                        var dateReceived = moment(purchase.get('dateReceived'));
                        return (dateReceived.isSame(effectiveDate, 'day') || dateReceived.isBefore(effectiveDate, 'day'));
                    });
                    if (Ember.isEmpty(inventoryPurchases)) {
                        //If there are no purchases applicable then skip this inventory item.
                        return;
                    }
                    //Setup intial locations for an inventory item
                    inventoryPurchases.forEach(function(purchase) {
                        var locationName = purchase.get('locationName'),
                            purchaseQuantity = purchase.get('originalQuantity');
                        purchase.set('calculatedQuantity', purchaseQuantity);
                        if (purchase.get('giftInKind') === true) {
                            row.giftInKind = 'Y';
                        }
                        this._adjustLocation(row.locations, locationName, purchaseQuantity, true);
                    }.bind(this));

                    if(!Ember.isEmpty(inventoryRequests)) {
                        inventoryRequests.forEach(function(request) {
                            var adjustPurchases = request.get('adjustPurchases'),                                
                                increment = false,
                                locations = request.get('locationsAffected'),
                                purchases = request.get('purchasesAffected'),
                                transactionType = request.get('transactionType');


                            increment = (transactionType === 'Adjustment (Add)');
                            if (adjustPurchases) {
                                if (!Ember.isEmpty(purchases)) {
                                    //Loop through purchase(s) on request and adjust corresponding inventory purchases
                                    purchases.forEach(function(purchaseInfo) {
                                        this._adjustPurchase(inventoryPurchases, purchaseInfo.id, purchaseInfo.quantity, increment);
                                    }.bind(this));
                                }
                            } else if (transactionType === 'Transfer') {
                                //Increment the delivery location
                                var aisle = request.get('deliveryAisle'), 
                                    location = request.get('deliveryLocation'), 
                                    locationName = this.formatLocationName(location, aisle);
                                    if (Ember.isEmpty(locationName)) {
                                        locationName = 'No Location';
                                    }
                                this._adjustLocation(row.locations,  locationName, request.get('quantity'), true);
                            }
                            //Loop through locations to adjust location quantity
                            locations.forEach(function(locationInfo){
                                this._adjustLocation(row.locations,  locationInfo.name, locationInfo.quantity, increment);
                            }.bind(this));
                        }.bind(this));
                    }

                    //Calculate quantity and cost per unit for the row
                    inventoryPurchases.forEach(function(purchase) {
                        var costPerUnit = purchase.get('costPerUnit'),
                            quantity = purchase.get('calculatedQuantity');                                    
                        row.quantityInStock += purchase.get('calculatedQuantity');
                        row.totalCost += (quantity * costPerUnit);
                    });
                    row.unitCost = (row.totalCost/row.quantityInStock).toFixed(2);
                    this._addReportRow(row);
                }.bind(this));
                this._generateExport();
            }.bind(this));
            this.set('showReportResults', true);
            this._setReportHeaders();
            this.set('reportEffectiveDate', effectiveDate);
        }
    },

    
    setup: function() {
        var effectiveDate = this.get('effectiveDate');
        if (Ember.isEmpty(effectiveDate)) {
            this.set('effectiveDate', new Date());
        }
    }.on('init')
});