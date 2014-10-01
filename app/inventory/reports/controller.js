import DateSort from 'hospitalrun/utils/date-sort';
import NumberFormat from 'hospitalrun/mixins/number-format';
export default Ember.ArrayController.extend(NumberFormat, {
    needs: ['inventory'],
    effectiveDate: null,
    inventoryItems: Ember.computed.alias('controllers.inventory.model'),
    reportColumns: {
        date: {
            label: 'Date',
            include: true,
            property: 'date'
        },
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
            property: 'inventoryItem.reorderPoint',
            numberFormat: true
        }, 
        price: {
            label: 'Price Per Unit',
            include: false,
            property: 'inventoryItem.price',
            numberFormat: true
        }, 
        quantity: {
            label: 'Quantity', 
            include: true,
            property: 'quantity',
            numberFormat: true
        },
        consumedPerDay: {
            label: 'Consumption Rate', 
            include: false,
            property: 'consumedPerDay'            
        },
        daysLeft: {
            label: 'Days Left', 
            include: false,
            property: 'daysLeft'
        },
        unit: {
            label: 'Distribution Unit', 
            include: true,
            property: 'inventoryItem.distributionUnit'
        },        
        unitcost: {
            label: 'Unit Cost',
            include: true,
            property: 'unitCost',
            numberFormat: true
        },
        total: {
            label: 'Total Cost',
            include: true,
            property: 'totalCost',
            numberFormat: true
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
        name: 'Days Supply Left In Stock',
        value: 'daysLeft'
    }, {
        name: 'Detailed Purchase',
        value: 'detailedPurchase'
    }, {
        name: 'Detailed Stock Usage',
        value: 'detailedUsage'
    }, {
        name: 'Detailed Stock Transfer',
        value: 'detailedTransfer'
    }, {        
        name: 'Expiration Date',
        value: 'expiration'
    }, {
        name: 'Inventory By Location',
        value: 'byLocation'
    }, {
        name: 'Inventory Valuation',
        value: 'valuation'
    }, {
        name: 'Summary Purchase',
        value: 'summaryPurchase'
    }, {
        name: 'Summary Stock Usage',
        value: 'summaryUsage'
    }, {
        name: 'Summary Stock Transfer',
        value: 'summaryTransfer'
    }],

    includeDate: function() {
        var reportType = this.get('reportType');
        if (!Ember.isEmpty(reportType) && reportType.indexOf('detailed') ===0) {
            this.set('reportColumns.date.include', true);                     
            return true;
        } else {
            this.set('reportColumns.date.include', false);
            return false;
        }
        
    }.property('reportType'),
    
    includeDaysLeft: function() {
        var reportType = this.get('reportType');
        if (reportType === 'daysLeft') {
            this.set('reportColumns.consumedPerDay.include', true);
            this.set('reportColumns.daysLeft.include', true);
            return true;
        } else {
            this.set('reportColumns.consumedPerDay.include', false);
            this.set('reportColumns.daysLeft.include', false);
            return false;
        }
        
    }.property('reportType'),    
    
    includeCostFields: function() {
        var reportType = this.get('reportType');
        if (reportType === 'detailedTransfer' || reportType === 'summaryTransfer' || reportType === 'daysLeft') {
            this.set('reportColumns.total.include', false);
            this.set('reportColumns.unitcost.include', false);
            return false;
        } else {
            this.set('reportColumns.total.include', true);
            this.set('reportColumns.unitcost.include', true);            
            return true;
        }
    }.property('reportType'),

    showEffectiveDate: function() {
        var reportType = this.get('reportType');
        if (reportType === 'valuation' || reportType === 'byLocation') {
            this.set('startDate', null);
            if (Ember.isEmpty(this.get('endDate'))) {
                this.set('endDate', new Date());
            }
            return true;
        } else {
            if (Ember.isEmpty(this.get('startDate'))) {
                this.set('startDate', new Date());
            }    
            return false;
        }
    }.property('reportType'),
    
    showReportResults: false,
    
    useFieldPicker: function() {
        var reportType = this.get('reportType');
        return (reportType !== 'expiration');
    }.property('reportType'),
    
    /**
     * Add a row to the report using the selected columns to add the row.
     * @param {Array} row the row to add
     * @param {boolean} skipNumberFormatting true if number columns should not be formatted.
     */
    _addReportRow: function(row, skipNumberFormatting) {
        var columnValue,
            locations, 
            locationDetails = '',
            reportColumns = this.get('reportColumns'),
            reportRows = this.get('reportRows'),
            reportRow = [];
        for (var column in reportColumns) {
            if (reportColumns[column].include) {
                columnValue = Ember.get(row,reportColumns[column].property);
                if (Ember.isEmpty(columnValue)) {
                     reportRow.push('');
                } else if (reportColumns[column].property === 'locations') {
                    locations = columnValue;
                    for (var i=0; i< locations.length; i++) {                        
                        if (i > 0) {
                            locationDetails += '; ';
                        }
                        if (!Ember.isEmpty(locations[i].quantity)) {
                            locationDetails += '%@ (%@ available)'.fmt(locations[i].name, 
                                               this.numberFormat(locations[i].quantity));
                        } else {
                            locationDetails += locations[i].name;
                        }
                    }
                    reportRow.push(locationDetails);
                } else if (reportColumns[column].numberFormat && !skipNumberFormatting) {
                    reportRow.push(this.numberFormat(columnValue));
                } else {
                    reportRow.push(columnValue);
                }
            }
        }
        reportRows.addObject(reportRow);
    },
    
    _addTotalsRow: function(label, summaryCost, summaryQuantity) {
        if (summaryQuantity > 0) {
            this._addReportRow({
                totalCost: label +  this.numberFormat(summaryCost),
                quantity: label + this.numberFormat(summaryQuantity),
                unitCost: label + this.numberFormat(summaryCost/summaryQuantity)
            }, true);
        }        
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
    
    _calculateCosts: function(inventoryPurchases, row) {
        //Calculate quantity and cost per unit for the row
        inventoryPurchases.forEach(function(purchase) {
            var costPerUnit = purchase.get('costPerUnit'),
                quantity = purchase.get('calculatedQuantity');                                    
            row.quantity += purchase.get('calculatedQuantity');
            row.totalCost += (quantity * costPerUnit);
        });
        row.unitCost = (row.totalCost/row.quantity);
        return row;
    },
    
    /**
     * Filter the records by the specified field and the the specified start and (optional) end dates.
     * @param {Array} records to filter.
     * @param {String} field name of the date field in the record to filter by.
     */
    _filterByDate: function(records, field) {
        var endDate = this.get('endDate'),
            startDate = this.get('startDate');        
        return records.filter(function(record) {
            var compareDate = moment(record.get(field));
            return ((Ember.isEmpty(endDate) || compareDate.isSame(endDate, 'day') || 
                     compareDate.isBefore(endDate, 'day')) &&
                    (Ember.isEmpty(startDate) || compareDate.isSame(startDate, 'day') || compareDate.isAfter(startDate, 'day')));
        });
    },
    
    _generateExpirationReport: function() {
        var grandQuantity = 0,
            inventoryItems = this.get('inventoryItems'),            
            reportRows = this.get('reportRows');
        
        inventoryItems.forEach(function(inventoryItem) {
            var inventoryPurchases = this._filterByDate(inventoryItem.get('purchases'), 'expirationDate');

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
                    grandQuantity += currentQuantity;
                }
            }.bind(this));
        }.bind(this));
        reportRows.addObject([
            '','','Total: ' + grandQuantity, '', ''
        ]);
        this.set('showReportResults', true);
        this.set('reportHeaders', ['Id','Name','Current Quantity','Distribution Unit','Expiration Date']);
        this._generateExport();
        this._setReportTitle();
    },        
    
    _generateExport: function() {
        var csvRows = [],
            reportHeaders = this.get('reportHeaders'),
            dataArray = [reportHeaders];
        dataArray.addObjects(this.get('reportRows'));
        dataArray.forEach(function(row) { 
            csvRows.push('"'+row.join('","')+'"');
        });
        var csvString = csvRows.join('\r\n');
        var uriContent = "data:application/csv;charset=utf-8," + encodeURIComponent(csvString);
        this.set('csvExport', uriContent);
    },
    
    _generateInventoryReport: function() {
        var dateDiff,
            inventoryItems = this.get('inventoryItems'),
            inventoryRequests =  this._filterByDate(this.get('model'), 'dateCompleted'),
            locationSummary = [],
            requestPromises = [],
            reportType = this.get('reportType');
        if (reportType === 'daysLeft') {
            var endDate = this.get('endDate'),
                startDate = this.get('startDate');
            if (Ember.isEmpty(endDate) || Ember.isEmpty(startDate)) {
                return;
            } else {
                dateDiff = moment(endDate).diff(startDate, 'days');
            }
        }
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
            var grandCost = 0,
                grandQuantity = 0;
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

                inventoryPurchases = this._filterByDate(inventoryPurchases, 'dateReceived');
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
                            var locationName = request.get('deliveryLocationName');
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
                    case 'byLocation': {
                        row.locations.forEach(function(location) {
                            var locationToUpdate = locationSummary.findBy('name', location.name);
                            if (Ember.isEmpty(locationToUpdate)) {
                                locationToUpdate = Ember.copy(location);
                                locationToUpdate.items = {};
                                locationSummary.push(locationToUpdate);
                            } else {
                                locationToUpdate.quantity += location.quantity;
                            }
                            var costData = this._calculateCosts(inventoryPurchases, {
                                quantity: 0,
                                totalCost: 0
                            });
                            locationToUpdate.items[item.id] = {
                                item: item,
                                quantity: location.quantity,
                                giftInKind: row.giftInKind,                                
                                totalCost: (costData.unitCost * location.quantity),
                                unitCost: costData.unitCost
                            };
                        }.bind(this));
                        break;
                    }
                    case 'daysLeft': {
                        var consumedQuantity = inventoryRequests.reduce(function(previousValue, request) {
                            if (request.get('transactionType') === 'Fulfillment') {
                                return previousValue += request.get('quantity');
                            } else {
                                return previousValue;
                            }
                        }, 0);
                        row.quantity = item.get('quantity');
                        if (consumedQuantity > 0) {
                            row.consumedPerDay = this.numberFormat(consumedQuantity/dateDiff);
                            row.daysLeft = this.numberFormat(row.quantity/row.consumedPerDay);
                        } else {
                            row.consumedPerDay = '?';
                            row.daysLeft = '?';                            
                        }
                        this._addReportRow(row);
                        break;
                    }                        
                    case 'detailedTransfer':
                    case 'detailedUsage': {
                        inventoryRequests.forEach(function(request) {
                            if ((reportType === 'detailedTransfer' && request.get('transactionType') === 'Transfer') || 
                                (reportType === 'detailedUsage' && request.get('transactionType') === 'Fulfillment')) {                                
                                var deliveryLocation = request.get('deliveryLocationName'),
                                    locations = [],
                                    totalCost = (request.get('quantity') * request.get('costPerUnit')); 
                                locations = request.get('locationsAffected').map(function(location) {
                                    if (reportType === 'detailedTransfer') {
                                        return {
                                            name: 'From: %@ To: %@'.fmt(location.name, deliveryLocation)
                                        };
                                    } else {
                                        return {
                                            name: '%@ from %@'.fmt(location.quantity, location.name)
                                        };                                        
                                    }
                                });
                                
                                this._addReportRow({
                                    date: moment(request.get('dateCompleted')).format('l'),
                                    giftInKind: row.giftInKind,
                                    inventoryItem: row.inventoryItem,
                                    quantity: request.get('quantity'),
                                    type: request.get('transactionType'),
                                    locations: locations,
                                    unitCost: request.get('costPerUnit'),
                                    totalCost: totalCost
                                });
                                summaryQuantity += request.get('quantity');
                                summaryCost += totalCost;
                            }
                        }.bind(this));
                        this._addTotalsRow('Subtotal: ', summaryCost, summaryQuantity);
                        grandCost +=summaryCost;
                        grandQuantity += summaryQuantity;
                        break;
                    }
                    case 'summaryTransfer':
                    case 'summaryUsage': {
                        row.quantity = inventoryRequests.reduce(function(previousValue, request) {
                            if ((reportType === 'summaryTransfer' && request.get('transactionType') === 'Transfer') || 
                                (reportType === 'summaryUsage' && request.get('transactionType') === 'Fulfillment')) {
                                var totalCost = (request.get('quantity') * request.get('costPerUnit')); 
                                summaryCost += totalCost;
                                return previousValue += request.get('quantity');
                            } else {
                                return previousValue;
                            }
                        }, 0);
                        if (row.quantity > 0) {
                            row.totalCost = summaryCost;
                            row.unitCost = (summaryCost/row.quantity);
                            this._addReportRow(row);
                            grandCost += summaryCost;
                            grandQuantity += row.quantity;
                        }
                        break;
                    }
                    case 'detailedPurchase': {
                        inventoryPurchases.forEach(function(purchase) {
                            var giftInKind = 'N';
                            if (purchase.get('giftInKind') === true) {
                                giftInKind = 'Y';
                            }
                            this._addReportRow({
                                date: moment(purchase.get('dateReceived')).format('l'),
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
                        }.bind(this));
                        this._addTotalsRow('Subtotal: ',summaryCost, summaryQuantity);
                        grandCost +=summaryCost;
                        grandQuantity += summaryQuantity;                        
                        break;
                    }
                    case 'summaryPurchase': {
                        row.locations = [];
                        row.quantity = inventoryPurchases.reduce(function(previousValue, purchase) {                            
                            summaryCost += purchase.get('purchaseCost');
                            row.locations.push({
                                name: purchase.get('locationName')                                
                            });
                            return previousValue += purchase.get('originalQuantity');
                        }, 0);
                        row.unitCost = (summaryCost/row.quantity);
                        row.totalCost = summaryCost;
                        this._addReportRow(row);
                        grandCost += summaryCost;
                        grandQuantity += row.quantity;                        
                        break;
                    }                                        
                    case 'valuation': {
                        this._calculateCosts(inventoryPurchases, row);
                        grandCost += row.totalCost;
                        grandQuantity += row.quantity;                        
                        this._addReportRow(row);
                        break;                        
                    }
                }
            }.bind(this));
            if (reportType === 'byLocation') {
                var currentLocation = '',
                    locationCost = 0,
                    parentLocation = '',
                    parentCount = 0,
                    subLocation = false;
                locationSummary = locationSummary.sortBy('name');
                locationSummary.forEach(function(location) {
                    if (location.name.indexOf(':') > -1) {
                        parentLocation = location.name.split(':')[0];
                        subLocation = true;
                    } else {
                        parentLocation = location.name;
                        subLocation = false;                        
                    }
                    if (currentLocation !== parentLocation) {
                        this._addTotalsRow('Total for %@: '.fmt(currentLocation), locationCost, parentCount);
                        parentCount = 0;
                        locationCost = 0;
                        currentLocation = parentLocation;
                    }
                    var subLocationCost = 0;
                    for (var id in location.items) {
                        this._addReportRow({
                            giftInKind: location.items[id].giftInKind,
                            inventoryItem: location.items[id].item,
                            quantity: location.items[id].quantity,
                            locations: [{
                                name: location.name
                            }], 
                            totalCost: location.items[id].totalCost,
                            unitCost: location.items[id].unitCost
                        });
                        parentCount += location.items[id].quantity;
                        locationCost += location.items[id].totalCost;
                        subLocationCost += location.items[id].totalCost;
                        grandCost += location.items[id].totalCost;
                        grandQuantity += location.items[id].quantity;
                    }
                    if (subLocation) {
                        this._addTotalsRow('Subtotal for %@: %@: '.fmt(location.name), subLocationCost, location.quantity);
                    }
                }.bind(this));
                this._addTotalsRow('Total for %@: '.fmt(parentLocation), locationCost, parentCount);
            } 
            this._addTotalsRow('Total: ', grandCost, grandQuantity);            
            this._generateExport();
        }.bind(this));
        this.set('showReportResults', true);
        this._setReportHeaders();
        this._setReportTitle();
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
    
    _setReportTitle: function() {
        var endDate = this.get('endDate'),
            formattedEndDate = '',
            formattedStartDate = '',
            reportType = this.get('reportType'),
            reportTypes = this.get('reportTypes'),
            startDate = this.get('startDate');
        if (!Ember.isEmpty(endDate)) {
            formattedEndDate = moment(endDate).format('l');
        }
        
        var reportDesc = reportTypes.findBy('value', reportType);
        if (Ember.isEmpty(startDate)) {
            this.set('reportTitle', '%@ Report %@'.fmt(reportDesc.name, formattedEndDate));
        } else {
            formattedStartDate = moment(startDate).format('l');
            this.set('reportTitle', '%@ Report %@ - %@'.fmt(reportDesc.name, formattedStartDate, formattedEndDate));
        }
    },
    
    actions: {
        generateReport: function() {
            var endDate = this.get('endDate'),
                reportRows = this.get('reportRows'),
                reportType = this.get('reportType'),
                startDate = this.get('startDate');
            if (Ember.isEmpty(startDate) && Ember.isEmpty(endDate)) {
                return;
            }
            reportRows.clear();            
            switch (reportType) {
                case 'expiration': {
                    this._generateExpirationReport();
                    break;                    
                }
                default: {
                    this._generateInventoryReport();
                    break;
                }
            }
        }
    }
});