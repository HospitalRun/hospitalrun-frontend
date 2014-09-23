import DateSort from 'hospitalrun/utils/date-sort';
import LocationName from "hospitalrun/mixins/location-name";
export default Ember.ArrayController.extend(LocationName, {
    needs: ['inventory'],
    effectiveDate: null,
    inventoryItems: Ember.computed.alias('controllers.inventory.model'),
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
            property: 'quantity'
        },
        unitcost: {
            label: 'Unit Cost',
            include: true,
            property: 'unitCost'
        },
        total: {
            label: 'Total Cost',
            include: true,
            property: 'totalCost'
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
    reportRows: [],
    reportTitle: null,
    reportType: null,
    reportTypes: [{
        name: 'Detailed Stock Usage',
        value: 'detailedUsage'
    }, {
        name: 'Summary Stock Usage',
        value: 'summaryUsage'
    }, {
        name: 'Detailed Purchase',
        value: 'detailedPurchase'
    }, {
        name: 'Summary Purchase',
        value: 'summaryPurchase'
    }, {
        name: 'Detailed Stock Transfer',
        value: 'detailedTransfer'
    }, {
        name: 'Summary Stock Transfer',
        value: 'summaryTransfer'
    }, {        
        name: 'Expiration date',
        value: 'expiration'
    }, {
        name: 'Inventory valuation',
        value: 'valuation'
    }],

    
    showReportResults: false,
    
    isValuationReport: function() {
        var reportType = this.get('reportType');
        return (reportType === 'valuation');
    }.property('reportType'),
    
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
                        if (!Ember.isEmpty(locations[i].quantity)) {
                            locationDetails += '%@ (%@ available)'.fmt(locations[i].name, locations[i].quantity);
                        } else {
                            locationDetails += locations[i].name;
                        }
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
    
    _generateExpirationReport: function() {
        var endDate = this.get('endDate'),
            inventoryItems = this.get('inventoryItems'),            
            reportRows = this.get('reportRows'),
            startDate = this.get('startDate');
        if (Ember.isEmpty(startDate)) {
            return;
        }
        reportRows.clear();
        inventoryItems.forEach(function(inventoryItem) {
            var inventoryPurchases = inventoryItem.get('purchases').filter(function(purchase) {
                var expirationDate = moment(purchase.get('expirationDate'));
                return ((Ember.isEmpty(endDate) || expirationDate.isSame(endDate, 'day') || 
                         expirationDate.isBefore(endDate, 'day')) && 
                        (expirationDate.isSame(startDate, 'day') || expirationDate.isAfter(startDate, 'day')));
            });

            inventoryPurchases.forEach(function(purchase) {
                var currentQuantity = purchase.get('currentQuantity'),
                    expirationDate = purchase.get('expirationDate');
                if (currentQuantity > 0 && !Ember.isEmpty('expirationDate')) {
                    reportRows.addObject([
                        inventoryItem.get('friendlyId'),
                        inventoryItem.get('name'),
                        currentQuantity,
                        inventoryItem.get('distributionUnit'),
                        moment(expirationDate).format('l')                        
                    ]);
                }
            }.bind(this));
        }.bind(this));
        this.set('showReportResults', true);
        this.set('reportHeaders', ['Id','Name','Current Quantity','Distribution Unit','Expiration Date']);
        this._generateExport();
        var formattedEndDate = '',
            formattedStartDate = moment(startDate).format('l');            
        if (!Ember.isEmpty(endDate)) {
            formattedEndDate = moment(endDate).format('l');
        }
        this.set('reportTitle', 'Inventory Expiration Date Report %@ - %@'.fmt(formattedStartDate, formattedEndDate));
        
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
    
    _generateValuationReport: function() {
        var effectiveDate = this.getWithDefault('effectiveDate', new Date()),
            inventoryItems = this.get('inventoryItems'),
            inventoryRequests = this.get('model').filter(function(item) {
                var dateCompleted = moment(item.get('dateCompleted'));
                return (dateCompleted.isSame(effectiveDate, 'day') || dateCompleted.isBefore(effectiveDate, 'day'));
            }),
            requestPromises = [],            
            reportRows = this.get('reportRows'),
            reportType = this.get('reportType');
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
                        quantity: 0,
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

                var summaryCost = 0,
                    summaryQuantity = 0;
                    
                switch(reportType) {
                    case 'detailedUsage': {
                        inventoryRequests.forEach(function(request) {
                            summaryQuantity += request.get('quantity');
                            this._addReportRow({
                                giftInKind: row.giftInKind,
                                inventoryItem: row.inventoryItem,
                                quantity: request.get('quantity'),
                                type: request.get('transactionType'),
                                locations: row.locations
                            });
                        });
                        this._addReportRow({
                            quantity: 'Total: '+summaryQuantity
                        });
                        break;
                    }
                    case 'summaryUsage': {
                        row.quantity = inventoryRequests.reduce(function(previousValue, request) {
                            return previousValue += request.get('quantity');
                        }, 0);
                        this._addReportRow(row);
                        break;
                    }
                    case 'detailedPurchase': {
                        inventoryPurchases.forEach(function(purchase) {
                            var giftInKind = 'N';
                            if (purchase.get('giftInKind') === true) {
                                giftInKind = 'Y';
                            }
                            this._addReportRow({
                                giftInKind: giftInKind,
                                inventoryItem: row.inventoryItem,
                                quantity: purchase.get('originalQuantity'),
                                unitCost: purchase.get('costPerUnit'),
                                totalCost: purchase.get('purchaseCost'),
                                locations: [{
                                    name: purchase.get('locationName')                                
                                }]
                            });
                            summaryCost += purchase.get('purchaseCost');
                            summaryQuantity += purchase.get('originalQuantity');
                        });
                        this._addReportRow({
                            totalCost: 'Total:'+summaryCost.toFixed(2),
                            quantity: 'Total: '+summaryQuantity,
                            unitCost: (summaryCost/summaryQuantity).toFixed(2)
                        });                            
                        break;
                    }
                    case 'summaryPurchase': {
                        row.quantity = inventoryPurchases.reduce(function(previousValue, purchase) {                            
                            summaryCost += purchase.get('purchaseCost');
                            return previousValue += purchase.get('originalQuantity');
                        }, 0);
                        row.unitCost = (summaryCost/row.quantity).toFixed(2);
                        row.totalCost = summaryCost.toFixed(2);
                        
                        this._addReportRow(row);
                        break;
                    }
                    case 'detailedTransfer': {
                        break;
                    }
                    case 'summaryTransfer': {
                        break;
                    }
                    case 'valuation': {
                        //Calculate quantity and cost per unit for the row
                        inventoryPurchases.forEach(function(purchase) {
                            var costPerUnit = purchase.get('costPerUnit'),
                                quantity = purchase.get('calculatedQuantity');                                    
                            row.quantity += purchase.get('calculatedQuantity');
                            row.totalCost += (quantity * costPerUnit);
                        });
                        row.totalCost = row.totalCost.toFixed(2);
                        row.unitCost = (row.totalCost/row.quantity).toFixed(2);
                        this._addReportRow(row);
                        break;                        
                    }
                }
            }.bind(this));
            this._generateExport();
        }.bind(this));
        this.set('showReportResults', true);
        this._setReportHeaders();
        this.set('reportTitle', 'Inventory Report Effective '+moment(effectiveDate).format('l'));
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
            var reportType = this.get('reportType');
            switch (reportType) {
                case 'expiration': {
                    this._generateExpirationReport();
                    break;                    
                }
                default: {
                    this._generateValuationReport();
                    break;
                }
            }
        }
    },

    
    setup: function() {
        var effectiveDate = this.get('effectiveDate'),
            reportType = this.get('reportType'),
            startDate = this.get('startDate');
        if (Ember.isEmpty(effectiveDate)) {
            this.set('effectiveDate', new Date());
        }
        if (Ember.isEmpty(reportType)) {
            this.set('reportType', 'valuation');
        }
        if (Ember.isEmpty(startDate)) {
            this.set('startDate', new Date());
        }        
    }.on('init')
});