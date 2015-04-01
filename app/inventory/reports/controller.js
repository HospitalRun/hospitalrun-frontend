import AbstractReportController from 'hospitalrun/controllers/abstract-report-controller';
import Ember from 'ember';
import LocationName from 'hospitalrun/mixins/location-name';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import NumberFormat from "hospitalrun/mixins/number-format";
export default AbstractReportController.extend(LocationName, ModalHelper, NumberFormat, {
    needs: ['pouchdb'],
    effectiveDate: null,
    pouchdbController: Ember.computed.alias('controllers.pouchdb'),
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
            format: '_numberFormat'
        }, 
        price: {
            label: 'Price Per Unit',
            include: false,
            property: 'inventoryItem.price',
            format: '_numberFormat'
        }, 
        quantity: {
            label: 'Quantity', 
            include: true,
            property: 'quantity',
            format: '_numberFormat'
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
            format: '_numberFormat'
        },
        total: {
            label: 'Total Cost',
            include: true,
            property: 'totalCost',
            format: '_numberFormat'
        },         
        gift: {
            label: 'Gift In Kind',
            include: true,
            property: 'giftInKind'
        },
        locations: {
            label: 'Locations',
            include: true,
            property: 'locations',
            format: '_addLocationColumn'
        },
        aisle: {
            label: 'Aisle',
            include: false,
            property: 'locations',
            format: '_addAisleColumn'
        },
        vendor: {
            label: 'Vendor',
            include: false,
            property: 'vendors'
        }
    },
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
    
    useFieldPicker: function() {
        var reportType = this.get('reportType');
        return (reportType !== 'expiration');
    }.property('reportType'),

    _addAisleColumn: function(locations) {
        if (!Ember.isEmpty(locations)) {
            return locations.map(function(location) {
                if (location.name.indexOf(':') > -1) {
                    return location.name.split(':')[1];
                }
            });
        }
    },
    
    _addLocationColumn: function(locations) {
        if (!Ember.isEmpty(locations)) {
            return locations.map(function(location) {
                if (location.name.indexOf(':') > -1) {
                    return location.name.split(':')[0];
                } else {
                    return location.name;
                }
            });
        }
    },
    
    _addTotalsRow: function(label, summaryCost, summaryQuantity) {
        if (summaryQuantity > 0) {
            this._addReportRow({
                totalCost: label +  this._numberFormat(summaryCost),
                quantity: label + this._numberFormat(summaryQuantity),
                unitCost: label + this._numberFormat(summaryCost/summaryQuantity)
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
        var purchaseToAdjust = purchases.findBy('_id', 'inv-purchase_'+purchaseId);
        if (!Ember.isEmpty(purchaseToAdjust)) {
            var calculatedQuantity = purchaseToAdjust.calculatedQuantity;
            if (increment) {
                calculatedQuantity += quantity;
            } else {
                calculatedQuantity -= quantity;
            }
            purchaseToAdjust.calculatedQuantity = calculatedQuantity;
        }        
    },
    
    _calculateCosts: function(inventoryPurchases, row) {
        //Calculate quantity and cost per unit for the row
        inventoryPurchases.forEach(function(purchase) {
            var costPerUnit = this._calculateCostPerUnit(purchase),
                quantity = purchase.calculatedQuantity;                                    
            row.quantity += purchase.calculatedQuantity;
            row.totalCost += (quantity * costPerUnit);
        }.bind(this));
        row.unitCost = (row.totalCost/row.quantity);
        return row;
    },
    
    _calculateCostPerUnit: function(purchase) {
        var purchaseCost = purchase.purchaseCost,
            quantity = parseInt(purchase.originalQuantity);
        if (Ember.isEmpty(purchaseCost) || Ember.isEmpty(quantity)) {
            return 0;
        }
        return Number((purchaseCost/quantity).toFixed(2));
    },
    
    _findInventoryItems: function(queryParams, view, inventoryList, childName) {
        if (Ember.isEmpty(inventoryList)) {
            inventoryList = {};
        }
        var pouchdbController = this.get('pouchdbController');
        return new Ember.RSVP.Promise(function(resolve, reject) {
            pouchdbController.queryMainDB(queryParams, view).then(function(inventoryChildren) {
                var inventoryKeys = Ember.keys(inventoryList),
                    inventoryIds = [];
                if (!Ember.isEmpty(inventoryChildren.rows)) {
                    inventoryChildren.rows.forEach(function (child) {
                        if (child.doc.inventoryItem && !inventoryKeys.contains(child.doc.inventoryItem)) {
                            inventoryIds.push(child.doc.inventoryItem);
                            inventoryKeys.push(child.doc.inventoryItem);
                        }
                    });
                }
                this._getInventoryItems(inventoryIds, inventoryList).then(function(inventoryMap) {
                    //Link inventory children to inventory items
                    inventoryChildren.rows.forEach(function(child) {
                        var childItem = inventoryMap[child.doc.inventoryItem];
                        if (!Ember.isEmpty(childItem)) {
                            var itemChildren = childItem[childName];
                            if (Ember.isEmpty(itemChildren)) {
                                itemChildren = [];
                            }
                            itemChildren.push(child.doc);
                            childItem[childName] = itemChildren;
                        }
                    });
                    resolve(inventoryMap);
                }, reject);
            }.bind(this), reject);
        }.bind(this));
    },    
    
    _findInventoryItemsByPurchase: function(reportTimes, inventoryMap) {
        return this._findInventoryItems({
            startkey: [reportTimes.startTime,'inv-purchase_'],
            endkey: [reportTimes.endTime,'inv-purchase_\uffff'],
            include_docs: true,
        }, 'inventory_purchase_by_date_received', inventoryMap, 'purchaseObjects');
    },
    
    _findInventoryItemsByRequest: function(reportTimes, inventoryMap) {
        return this._findInventoryItems({
            startkey: ['Completed',reportTimes.startTime,'inv-request_'],            
            endkey: ['Completed',reportTimes.endTime,'inv-request_\uffff'],
            include_docs: true,
        }, 'inventory_request_by_status', inventoryMap, 'requestObjects');
    },    

    _generateExpirationReport: function() {
        var grandQuantity = 0,
            pouchdbController = this.get('pouchdbController'),
            reportRows = this.get('reportRows'),
            reportTimes = this._getDateQueryParams();
        pouchdbController.queryMainDB({
            startkey:  [reportTimes.startTime, 'inv-purchase_'],
            endkey: [reportTimes.endTime, 'inv-purchase_\uffff'], 
            include_docs: true,
        }, 'inventory_purchase_by_expiration_date').then(function(inventoryPurchases) {
            var purchaseDocs = [],
                inventoryIds = [];
            
            inventoryPurchases.rows.forEach(function(purchase) {
                if (purchase.doc.currentQuantity > 0 && !Ember.isEmpty(purchase.doc.expirationDate)) {
                    purchaseDocs.push(purchase.doc);
                    inventoryIds.push(purchase.doc.inventoryItem);
                    //promises.push(pouchdbController.getDocFromMainDB(purchase.id));
                }
            }.bind(this));
            this._getInventoryItems(inventoryIds).then(function(inventoryMap) {
                purchaseDocs.forEach(function(purchase) {
                    var currentQuantity = purchase.currentQuantity,
                        expirationDate = new Date(purchase.expirationDate),
                        inventoryItem = inventoryMap[purchase.inventoryItem];
                    if (inventoryItem) {
                        reportRows.addObject([
                            inventoryItem.friendlyId,
                            inventoryItem.name,
                            currentQuantity,
                            inventoryItem.distributionUnit,
                            moment(expirationDate).format('l')                        
                        ]);                    
                        grandQuantity += currentQuantity;
                    }
                }.bind(this));
                reportRows.addObject([
                    '','','Total: ' + grandQuantity, '', ''
                ]);
                this.set('showReportResults', true);
                this.set('reportHeaders', ['Id','Name','Current Quantity','Distribution Unit','Expiration Date']);
                this._generateExport();
                this._setReportTitle();
                this.closeProgressModal();
            }.bind(this));
        }.bind(this));
        
    },        
    
    _generateInventoryReport: function() {
        var dateDiff,            
            locationSummary = [],
            reportType = this.get('reportType'),
            reportTimes = this._getDateQueryParams();
        if (reportType === 'daysLeft') {
            var endDate = this.get('endDate'),
                startDate = this.get('startDate');
            if (Ember.isEmpty(endDate) || Ember.isEmpty(startDate)) {
                this.closeProgressModal();
                return;
            } else {
                dateDiff = moment(endDate).diff(startDate, 'days');
            }
        }
        this._findInventoryItemsByRequest(reportTimes,{}).then(function(inventoryMap) {
            this._findInventoryItemsByPurchase(reportTimes, inventoryMap).then(function(inventoryMap) {
                //Loop through each inventory item, looking at the requests and purchases to determine
                //state of inventory at effective date
                var grandCost = 0,
                    grandQuantity = 0;
                Ember.keys(inventoryMap).forEach(function(key) {
                    if (Ember.isEmpty(inventoryMap[key])) {
                        //If the inventory item has been deleted, ignore it.
                        return;
                    }
                    var item = inventoryMap[key],
                        inventoryPurchases = item.purchaseObjects,
                        inventoryRequests = item.requestObjects,
                        row = {
                            giftInKind: 'N',
                            inventoryItem: item,
                            quantity: 0,
                            unitCost: 0,
                            totalCost: 0,
                            locations: [
                            ],
                            vendors: [
                            ]
                        };
                    if (Ember.isEmpty(inventoryPurchases)) {
                        //If there are no purchases applicable then skip this inventory item.
                        return;
                    }
                    //Setup intial locations for an inventory item
                    inventoryPurchases.forEach(function(purchase) {
                        var locationName = this.getDisplayLocationName(purchase.location, purchase.aisleLocation),
                            purchaseQuantity = purchase.originalQuantity;
                        purchase.calculatedQuantity = purchaseQuantity;
                        if (purchase.giftInKind === true) {
                            row.giftInKind = 'Y';
                        }
                        if (!Ember.isEmpty(purchase.vendor)) {
                            if (!row.vendors.contains(purchase.vendor)) {
                                row.vendors.push(purchase.vendor);
                            }
                        }
                        this._adjustLocation(row.locations, locationName, purchaseQuantity, true);
                    }.bind(this));

                    if(!Ember.isEmpty(inventoryRequests)) {
                        inventoryRequests.forEach(function(request) {
                            var adjustPurchases = request.adjustPurchases,
                                increment = false,
                                locations = request.locationsAffected,
                                purchases = request.purchasesAffected,
                                transactionType = request.transactionType;


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
                                var locationName = this.getDisplayLocationName(request.deliveryLocation, request.deliveryAisle);
                                this._adjustLocation(row.locations,  locationName, request.quantity, true);
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
                                    locationToUpdate.quantity += this._getValidNumber(location.quantity);
                                }
                                var costData = this._calculateCosts(inventoryPurchases, {
                                    quantity: 0,
                                    totalCost: 0
                                });
                                locationToUpdate.items[item._id] = {
                                    item: item,
                                    quantity: this._getValidNumber(location.quantity),
                                    giftInKind: row.giftInKind,                                
                                    totalCost: (this._getValidNumber(costData.unitCost) * this._getValidNumber(location.quantity)),
                                    unitCost: this._getValidNumber(costData.unitCost)
                                };
                            }.bind(this));
                            break;
                        }
                        case 'daysLeft': {
                            if (!Ember.isEmpty(inventoryRequests)) {
                                var consumedQuantity = inventoryRequests.reduce(function(previousValue, request) {
                                    if (request.transactionType === 'Fulfillment') {
                                        return previousValue += this._getValidNumber(request.quantity);
                                    } else {
                                        return previousValue;
                                    }
                                }.bind(this), 0);
                                row.quantity = this._getValidNumber(item.quantity);
                                if (consumedQuantity > 0) {
                                    row.consumedPerDay = this._numberFormat(consumedQuantity/dateDiff);
                                    row.daysLeft = this._numberFormat(row.quantity/row.consumedPerDay);
                                } else {
                                    row.consumedPerDay = '?';
                                    row.daysLeft = '?';                            
                                }
                                this._addReportRow(row);
                            }
                            break;
                        }                        
                        case 'detailedTransfer':
                        case 'detailedUsage': {
                            if (!Ember.isEmpty(inventoryRequests)) {
                                inventoryRequests.forEach(function(request) {
                                    if ((reportType === 'detailedTransfer' && request.transactionType === 'Transfer') || 
                                        (reportType === 'detailedUsage' && request.transactionType === 'Fulfillment')) {                                
                                        var deliveryLocation = this.getDisplayLocationName(request.deliveryLocation, request.deliveryAisle),
                                            locations = [],
                                            totalCost = (this._getValidNumber(request.quantity) * this._getValidNumber(request.costPerUnit)); 
                                        locations = request.locationsAffected.map(function(location) {
                                            if (reportType === 'detailedTransfer') {
                                                return {
                                                    name: 'From: %@ To: %@'.fmt(location.name, deliveryLocation)
                                                };
                                            } else {
                                                return {
                                                    name: '%@ from %@'.fmt(this._getValidNumber(location.quantity), location.name)
                                                };                                        
                                            }
                                        }.bind(this));
                                        this._addReportRow({
                                            date: moment(new Date(request.dateCompleted)).format('l'),
                                            giftInKind: row.giftInKind,
                                            inventoryItem: row.inventoryItem,
                                            quantity: request.quantity,
                                            type: request.transactionType,
                                            locations: locations,
                                            unitCost: request.costPerUnit,
                                            totalCost: totalCost
                                        });
                                        summaryQuantity += this._getValidNumber(request.quantity);
                                        summaryCost += this._getValidNumber(totalCost);
                                    }
                                }.bind(this));
                                this._addTotalsRow('Subtotal: ', summaryCost, summaryQuantity);
                                grandCost +=summaryCost;
                                grandQuantity += summaryQuantity;
                            }
                            break;
                        }
                        case 'summaryTransfer':
                        case 'summaryUsage': {
                            if (!Ember.isEmpty(inventoryRequests)) {
                                row.quantity = inventoryRequests.reduce(function(previousValue, request) {
                                    if ((reportType === 'summaryTransfer' && request.transactionType === 'Transfer') || 
                                        (reportType === 'summaryUsage' && request.transactionType === 'Fulfillment')) {
                                        var totalCost = (this._getValidNumber(request.quantity) * this._getValidNumber(request.costPerUnit)); 
                                        summaryCost += totalCost;
                                        return previousValue += this._getValidNumber(request.quantity);
                                    } else {
                                        return previousValue;
                                    }
                                }.bind(this), 0);
                                if (row.quantity > 0) {
                                    row.totalCost = summaryCost;
                                    row.unitCost = (summaryCost/row.quantity);
                                    this._addReportRow(row);
                                    grandCost += summaryCost;
                                    grandQuantity += row.quantity;
                                }
                            }
                            break;
                        }
                        case 'detailedPurchase': {
                            inventoryPurchases.forEach(function(purchase) {
                                var giftInKind = 'N';
                                if (purchase.giftInKind === true) {
                                    giftInKind = 'Y';
                                }
                                this._addReportRow({
                                    date: moment(new Date(purchase.dateReceived)).format('l'),
                                    giftInKind: giftInKind,
                                    inventoryItem: row.inventoryItem,
                                    quantity: purchase.originalQuantity,
                                    unitCost: purchase.costPerUnit,
                                    totalCost: purchase.purchaseCost,
                                    locations: [{
                                        name: this.getDisplayLocationName(purchase.location, purchase.aisleLocation)
                                    }]
                                });
                                summaryCost += this._getValidNumber(purchase.purchaseCost);
                                summaryQuantity += this._getValidNumber(purchase.originalQuantity);
                            }.bind(this));
                            this._addTotalsRow('Subtotal: ',summaryCost, summaryQuantity);
                            grandCost +=summaryCost;
                            grandQuantity += summaryQuantity;
                            break;
                        }
                        case 'summaryPurchase': {
                            row.locations = [];
                            row.quantity = inventoryPurchases.reduce(function(previousValue, purchase) {
                                summaryCost += this._getValidNumber(purchase.purchaseCost);
                                var locationName = this.getDisplayLocationName(purchase.location, purchase.aisleLocation);
                                if (!row.locations.findBy('name', locationName)) {
                                    row.locations.push({
                                        name: this.getDisplayLocationName(purchase.location, purchase.aisleLocation)
                                    });
                                }
                                return previousValue += this._getValidNumber(purchase.originalQuantity);
                            }.bind(this), 0);
                            row.unitCost = (summaryCost/row.quantity);
                            row.totalCost = summaryCost;
                            this._addReportRow(row);
                            grandCost += summaryCost;
                            grandQuantity += row.quantity;
                            break;
                        }                                        
                        case 'valuation': {
                            this._calculateCosts(inventoryPurchases, row);
                            grandCost += this._getValidNumber(row.totalCost);
                            grandQuantity += this._getValidNumber(row.quantity);
                            this._addReportRow(row);
                            break;
                        }
                    }
                }.bind(this));
                if (reportType === 'byLocation') {
                    var currentLocation = '',
                        locationCost = 0,
                        parentLocation = '',
                        parentCount = 0;                    
                    locationSummary = locationSummary.sortBy('name');
                    locationSummary.forEach(function(location) {
                        if (location.name.indexOf(':') > -1) {
                            parentLocation = location.name.split(':')[0].trim();
                        } else {
                            parentLocation = location.name;
                        }
                        if (currentLocation !== parentLocation) {
                            this._addTotalsRow('Total for %@: '.fmt(currentLocation), locationCost, parentCount);
                            parentCount = 0;
                            locationCost = 0;
                            currentLocation = parentLocation;
                        }
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
                            parentCount += this._getValidNumber(location.items[id].quantity);
                            locationCost += this._getValidNumber(location.items[id].totalCost);
                            grandCost += this._getValidNumber(location.items[id].totalCost);
                            grandQuantity += this._getValidNumber(location.items[id].quantity);
                        }
                    }.bind(this));
                    this._addTotalsRow('Total for %@: '.fmt(parentLocation), locationCost, parentCount);
                } 
                this._addTotalsRow('Total: ', grandCost, grandQuantity);
                this._finishReport();
            }.bind(this), function(err) {
                this._notifyReportError('Error in _findInventoryItemsByPurchase:'+err);
            }.bind(this));
        }.bind(this), function(err) {
            this._notifyReportError('Error in _findInventoryItemsByRequest:'+err);
        }.bind(this));
    },
    
    _getDateQueryParams: function() {
        var endDate = this.get('endDate'),
            endTime = this.get('maxValue'),
            startDate = this.get('startDate'),
            startTime;  
        if (!Ember.isEmpty(endDate)) {
            endTime = moment(endDate).startOf('day').toDate().getTime();
        }
        if (!Ember.isEmpty(startDate)) {
            startTime = moment(startDate).startOf('day').toDate().getTime();
        }
        return {
            endTime: endTime,
            startTime: startTime            
        };
    },
    
    _getInventoryItems: function(inventoryIds, inventoryMap) {
        var pouchdbController = this.get('pouchdbController');
        return new Ember.RSVP.Promise(function(resolve, reject) {
            if (Ember.isEmpty(inventoryMap)) {
                inventoryMap = {};
            }
            pouchdbController.queryMainDB({
                keys: inventoryIds,
                include_docs: true
            }).then(function(inventoryItems) {
                inventoryItems.rows.forEach(function(inventoryItem) {
                    inventoryMap[inventoryItem.id] = inventoryItem.doc;
                });
                resolve(inventoryMap);
            }, reject);
        });
    },
        
    _notifyReportError: function(errorMessage) {
        var alertMessage = 'An error was encountered while generating the requested report.  Please let your system administrator know that you have encountered an error.';
        this.closeProgressModal();
        this.displayAlert('Error Generating Report', alertMessage);
        throw new Error(errorMessage);
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
            this.showProgressModal();
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