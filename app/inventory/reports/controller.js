import AbstractReportController from 'hospitalrun/controllers/abstract-report-controller';
import Ember from 'ember';
import LocationName from 'hospitalrun/mixins/location-name';
import ModalHelper from 'hospitalrun/mixins/modal-helper';
import NumberFormat from "hospitalrun/mixins/number-format";
import InventoryAdjustmentTypes from "hospitalrun/mixins/inventory-adjustment-types";
export default AbstractReportController.extend(LocationName, ModalHelper, NumberFormat, InventoryAdjustmentTypes, {
    needs: ['inventory','pouchdb'],
    effectiveDate: null,
    expenseCategories: ['Inventory Consumed', 'Gift In Kind Usage', 'Inventory Obsolence'],
    expenseMap: null,
    grandCost: 0,
    grandQuantity: 0,
    locationSummary: null,
    pouchdbController: Ember.computed.alias('controllers.pouchdb'),
    warehouseList: Ember.computed.alias('controllers.inventory.warehouseList'),
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
        transactionType: {
            label: 'Adjustment Type',
            include: false,
            property: 'transactionType'
        }, 
        expenseAccount: {
            label: 'Expense To',
            include: false,
            property: 'expenseAccount'
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
            label: 'Sale Price Per Unit',
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
        name: 'Detailed Adjustment',
        value: 'detailedAdjustment'
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
        name: 'Detailed Expenses',
        value: 'detailedExpense'
    },  {        
        name: 'Expiration Date',
        value: 'expiration'
    }, {
        name: 'Inventory By Location',
        value: 'byLocation'
    }, {
        name: 'Inventory Valuation',
        value: 'valuation'
    }, {        
        name: 'Summary Expenses',
        value: 'summaryExpense'
    }, {
        name: 'Summary Purchase',
        value: 'summaryPurchase'
    }, {
        name: 'Summary Stock Usage',
        value: 'summaryUsage'
    }, {
        name: 'Summary Stock Transfer',
        value: 'summaryTransfer'
    }, {        
        name: 'Finance Summary',
        value: 'summaryFinance'
    }],
    
    hideLocationFilter: function() {
        var reportType = this.get('reportType');
        return (reportType === 'summaryFinance');
    }.property('reportType'),

    
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
        
    includeExpenseAccount: function() {    
        var reportType = this.get('reportType');
        switch (reportType) {
            case 'detailedAdjustment':
            case 'detailedTransfer':                            
            case 'detailedUsage': {
                return true;
            }
            case 'detailedExpense': {
                this.set('reportColumns.expenseAccount.include', true);
                return true;
            }        
            default: {
                this.set('reportColumns.expenseAccount.include', false);
                return false;
            }
        }
    }.property('reportType'),
    
    includeTransactionType: function() {
        var reportType = this.get('reportType');
        if (reportType === 'detailedAdjustment') {
            this.set('reportColumns.transactionType.include', true);
            return true;
        } else {
            this.set('reportColumns.transactionType.include', false);
            return false;
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
        return (reportType !== 'expiration' && reportType !== 'summaryFinance');
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
            var returnLocations = [];
            locations.forEach(function(location) {
                var formattedName;
                if (location.name.indexOf('From:') === 0) {
                    formattedName = location.name;
                } else {
                    formattedName = this._getWarehouseLocationName(location.name);
                }
                if (!returnLocations.contains(formattedName)) {
                    returnLocations.push(formattedName);
                }
            }.bind(this));
            return returnLocations;
        }
    },
    
    _addReportRow: function(row, skipNumberFormatting, reportColumns, rowAction) {
        if (Ember.isEmpty(rowAction) && !Ember.isEmpty(row.inventoryItem) && !Ember.isEmpty(row.inventoryItem._id)) {
            rowAction = {
                action: 'viewInventory',
                model: row.inventoryItem._id.substr(10)
            };
        }
        this._super(row, skipNumberFormatting, reportColumns, rowAction);
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
        if (!Ember.isEmpty(inventoryPurchases)) {
            inventoryPurchases.forEach(function(purchase) {
                var costPerUnit = this._calculateCostPerUnit(purchase),
                    quantity = purchase.calculatedQuantity;                                    
                row.quantity += purchase.calculatedQuantity;
                row.totalCost += (quantity * costPerUnit);
            }.bind(this));
        }
        if (row.totalCost === 0 || row.quantity === 0) {
            row.unitCost = 0;
        } else {
            row.unitCost = (row.totalCost/row.quantity);
        }
        return row;
    },

    _calculateUsage: function(inventoryPurchases, row) {
        //Calculate quantity and cost per unit for the row
        if (!Ember.isEmpty(inventoryPurchases)) {
            inventoryPurchases.forEach(function(purchase) {
                var costPerUnit = this._calculateCostPerUnit(purchase),
                    quantity = purchase.calculatedQuantity;                                    
                row.quantity -= purchase.calculatedQuantity;
                row.totalCost -= (quantity * costPerUnit);
            }.bind(this));
        }
        if (row.totalCost === 0 || row.quantity === 0) {
            row.unitCost = 0;
        } else {
            row.unitCost = (row.totalCost/row.quantity);
        }
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
    
    _finishExpenseReport: function(reportType) {
        var expenseCategories = this.get('expenseCategories'),
            expenseMap = this.get('expenseMap');            
        expenseCategories.forEach(function(category) {
            var categoryTotal = 0,
                expenseAccountName,
                totalLabel;
            this._addReportRow({
                inventoryItem: {
                    name: 'Expenses for: '+category
                }
            });
            expenseMap[category].expenseAccounts.forEach(function(expenseAccount) {
                if (reportType === 'detailedExpense') {
                    expenseAccount.reportRows.forEach(function(row) {
                        this._addReportRow(row);
                    }.bind(this));
                }
                if (Ember.isEmpty(expenseAccount.name)) {
                    expenseAccountName = '(No Account)';
                } else {
                    expenseAccountName = expenseAccount.name;
                }
                totalLabel = 'Subtotal for %@: '.fmt(category+' - '+expenseAccountName);
                this._addReportRow({
                    totalCost: totalLabel +  this._numberFormat(expenseAccount.total)
                }, true);
                categoryTotal += expenseAccount.total;
            }.bind(this));
           totalLabel = 'Total for %@: '.fmt(category);
            this._addReportRow({
                totalCost: totalLabel +  this._numberFormat(categoryTotal)
            }, true);
            this.incrementProperty('grandCost', categoryTotal);
        }.bind(this));  
        this._addReportRow({
            totalCost: 'Total: ' +  this._numberFormat(this.get('grandCost'))
        }, true);
    },
    
    _finishLocationReport: function() {
        var currentLocation = '',
            locationCost = 0,
            locationSummary = this.get('locationSummary'),
            parentLocation = '',
            parentCount = 0;                    
        locationSummary = locationSummary.sortBy('name');
        locationSummary.forEach(function(location) {
            parentLocation = this._getWarehouseLocationName(location.name);
            if (currentLocation !== parentLocation) {
                this._addTotalsRow('Total for %@: '.fmt(currentLocation), locationCost, parentCount);
                parentCount = 0;
                locationCost = 0;
                currentLocation = parentLocation;
            }
            if (this._includeLocation(parentLocation)) {
                for (var id in location.items) {
                    if (location.items[id].quantity > 0) {
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
                        this.incrementProperty('grandCost', this._getValidNumber(location.items[id].totalCost));
                        this.incrementProperty('grandQuantity', this._getValidNumber(location.items[id].quantity));
                    }
                }
            }
        }.bind(this));
        if (parentCount > 0) {
            this._addTotalsRow('Total for %@: '.fmt(parentLocation), locationCost, parentCount);
        }
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
                }
            }.bind(this));
            this._getInventoryItems(inventoryIds).then(function(inventoryMap) {
                purchaseDocs.forEach(function(purchase) {
                    var currentQuantity = purchase.currentQuantity,
                        expirationDate = new Date(purchase.expirationDate),
                        inventoryItem = inventoryMap[purchase.inventoryItem];
                    if (inventoryItem && this._includeLocation(purchase.location)) {
                        reportRows.addObject([
                            inventoryItem.friendlyId,
                            inventoryItem.name,
                            currentQuantity,
                            inventoryItem.distributionUnit,
                            moment(expirationDate).format('l'),
                            this.formatLocationName(purchase.location, purchase.aisleLocation)
                        ]);                    
                        grandQuantity += currentQuantity;
                    }
                }.bind(this));
                reportRows.addObject([
                    '','','Total: ' + grandQuantity, '', ''
                ]);
                this.set('showReportResults', true);
                this.set('reportHeaders', ['Id','Name','Current Quantity','Distribution Unit','Expiration Date', 'Location']);
                this._generateExport();
                this._setReportTitle();
                this.closeProgressModal();
            }.bind(this));
        }.bind(this));
        
    },
    
    _generateFinancialSummaryReport: function() {
        var reportTimes = this._getDateQueryParams();
        /*
        step 1: find the valuation as of start date, 
        meaning that we need to exchange the end date to be the start date and then tabulate the value
        */
        this._calculateBeginningBalance(reportTimes).then(function(beginningBalance) {
            this._generateSummaries(reportTimes).then(function(inventoryAdjustment) {
                var i = this._numberFormat(beginningBalance+inventoryAdjustment);
                if ((beginningBalance+inventoryAdjustment) < 0) {
                    this.get('reportRows').addObject(['Ending Balance', '', '('+i+')']);  
                } else {
                    this.get('reportRows').addObject(['Ending Balance', '', i]);  
                }
                this.set('showReportResults', true);
                this.set('reportHeaders', ['Category', 'Type', 'Total']);
                this._generateExport();
                this._setReportTitle();
                this.closeProgressModal();
            }.bind(this), function(err) {
                this._notifyReportError('Error in _generateFinancialSummaryReport:'+err);
            }.bind(this));
        }.bind(this));
    },
    
    _generateSummaries: function(reportTimes) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            var adjustedValue = 0;
            /*
            cycle through each purchase and request from the beginning of time until startTime 
            to determine the total value of inventory as of that date/time.
            */
            this._findInventoryItemsByRequest(reportTimes,{}).then(function(inventoryMap) {
                this._findInventoryItemsByPurchase(reportTimes, inventoryMap).then(function(inventoryMap) {
                    var purchaseSummary = [],
                        consumed = [],
                        gikConsumed = [],
                        adjustments = [];
                    this.adjustmentTypes.forEach(function(adjustmentType) {
                        adjustments[adjustmentType.type] = [];
                    });
                    Ember.keys(inventoryMap).forEach(function(key) {
                        if (Ember.isEmpty(key) || Ember.isEmpty(inventoryMap[key])) {
                            //If the inventory item has been deleted, ignore it.
                            return;
                        }
                        var item = inventoryMap[key];

                        if (!Ember.isEmpty(item.purchaseObjects)) {
                            item.purchaseObjects.forEach(function(purchase) {
                                purchaseSummary[item.type] = this._getValidNumber(purchaseSummary[item.type]) + this._getValidNumber(purchase.purchaseCost);
                            }.bind(this));
                        }
                        if (!Ember.isEmpty(item.requestObjects)) {
                            item.requestObjects.forEach(function(request) {
                                //we have three categories here: consumed, gik consumed, and adjustments
                                if (request.adjustPurchases) {
                                    if (request.transactionType === 'Fulfillment') {
                                        if (request.giftInKind) {
                                            gikConsumed[item.type] = this._getValidNumber(gikConsumed[item.type]) + (this._getValidNumber(request.quantity * request.costPerUnit));
                                        } else {
                                            consumed[item.type] = this._getValidNumber(consumed[item.type]) + (this._getValidNumber(request.quantity * request.costPerUnit));
                                        }
                                    } else {
                                        adjustments[request.transactionType][item.type] = this._getValidNumber(adjustments[request.transactionType][item.type]) + (this._getValidNumber(request.quantity * request.costPerUnit));
                                    }
                                }
                            }.bind(this));
                        }
                    }.bind(this));
                    //write the purchase rows
                    if (Object.keys(purchaseSummary).length > 0) {
                        var purchaseTotal = 0;
                        this.get('reportRows').addObject(['Purchases', '', '']);  
                        Ember.keys(purchaseSummary).forEach(function(key) {
                            var i = this._getValidNumber( purchaseSummary[key]);
                            purchaseTotal += i;
                            this.get('reportRows').addObject(['', key, this._numberFormat(i)]);    
                        }.bind(this));
                        this.get('reportRows').addObject(['Total Purchases', '', this._numberFormat(purchaseTotal)]);  
                        adjustedValue += purchaseTotal;
                    } 
                    //write the consumed rows                    
                    if (Object.keys(consumed).length > 0 || Object.keys(gikConsumed).length > 0) {
                        this.get('reportRows').addObject(['Consumed', '', '']); 
                        var overallValue = 0;
                        if (Object.keys(consumed).length > 0) {
                            this.get('reportRows').addObject(['Purchases Consumed', '', '']);  
                            var consumedTotal = 0;
                            Ember.keys(consumed).forEach(function(key) {
                                var i = this._getValidNumber( consumed[key]);
                                consumedTotal += i;
                                this.get('reportRows').addObject(['', key, '('+ this._numberFormat(i)+')']);    
                            }.bind(this));
                            overallValue += consumedTotal;
                            this.get('reportRows').addObject(['Total Purchases Consumed', '', '('+ this._numberFormat(consumedTotal)+')']);
                        }
                        if (Object.keys(gikConsumed).length > 0) {
                            this.get('reportRows').addObject(['GIK Consumed', '', '']);  
                            var gikTotal = 0;
                            Ember.keys(gikConsumed).forEach(function(key) {
                                var i = this._getValidNumber( gikConsumed[key]);
                                gikTotal += i;
                                this.get('reportRows').addObject(['', key, '('+ this._numberFormat(i)+')']);    
                            }.bind(this));
                            overallValue += gikTotal;
                            this.get('reportRows').addObject(['Total GIK Consumed', '', '('+this._numberFormat(gikTotal)+')']);
                        }
                        this.get('reportRows').addObject(['Total Consumed', '', '('+this._numberFormat(overallValue)+')']);     
                        adjustedValue -= overallValue;
                    }
                    //write the adjustment rows
                    var adjustmentTotal = 0;
                    this.get('reportRows').addObject(['Adjustments', '', '']);  
                    Ember.keys(adjustments).forEach(function(adjustmentT) {
                        if (Object.keys(adjustments[adjustmentT]).length > 0) {
                            this.get('reportRows').addObject([adjustmentT, '', '']);  
                            Ember.keys(adjustments[adjustmentT]).forEach(function(key) {
                                var i = this._getValidNumber( adjustments[adjustmentT][key]);
                                if (adjustmentT === 'Adjustment (Add)' || adjustmentT === 'Return') {
                                    adjustmentTotal += i;
                                    this.get('reportRows').addObject(['', key, this._numberFormat(i)]);    
                                } else {
                                    adjustmentTotal -= i;
                                    this.get('reportRows').addObject(['', key, '('+this._numberFormat(i)+')']);    
                                }                                
                            }.bind(this));
                        }
                    }.bind(this));
                    if (adjustmentTotal < 0) {
                        this.get('reportRows').addObject(['Total Adjustments', '', '('+this._numberFormat(adjustmentTotal)+')']);  
                    } else {
                        this.get('reportRows').addObject(['Total Adjustments', '', this._numberFormat(adjustmentTotal)]);  
                    }
                    
                    adjustedValue += adjustmentTotal;
                    resolve(adjustedValue);
                }.bind(this), reject);
            }.bind(this), reject);  
        }.bind(this));
    },    

    _calculateBeginningBalance: function(reportTimes) {
        return new Ember.RSVP.Promise(function(resolve, reject) {
            
            var startingValueReportTimes = {
                    startTime: null,
                    endTime: reportTimes.startTime            
                },
                beginningBalance = 0;
            /*
            cycle through each purchase and request from the beginning of time until startTime 
            to determine the total value of inventory as of that date/time.
            */
            this._findInventoryItemsByRequest(startingValueReportTimes,{}).then(function(inventoryMap) {
                this._findInventoryItemsByPurchase(startingValueReportTimes, inventoryMap).then(function(inventoryMap) {
                    Ember.keys(inventoryMap).forEach(function(key) {
                        if (Ember.isEmpty(key) || Ember.isEmpty(inventoryMap[key])) {
                            //If the inventory item has been deleted, ignore it.
                            return;
                        }
                        var item = inventoryMap[key],
                            inventoryPurchases = item.purchaseObjects,
                            inventoryRequests = item.requestObjects,
                            row = {
                                inventoryItem: item,
                                quantity: 0,
                                unitCost: 0,
                                totalCost: 0
                            };
                        if (!Ember.isEmpty(inventoryPurchases)) {
                            //Setup intial locations for an inventory item
                            inventoryPurchases.forEach(function(purchase) {
                                var purchaseQuantity = purchase.originalQuantity;
                                purchase.calculatedQuantity = purchaseQuantity;
                            });
                        }
                        if (!Ember.isEmpty(inventoryRequests)) {
                            inventoryRequests.forEach(function(request) {
                                var adjustPurchases = request.adjustPurchases,
                                    increment = false,
                                    purchases = request.purchasesAffected,
                                    transactionType = request.transactionType;
                                increment = (transactionType === 'Adjustment (Add)' || transactionType === 'Return');
                                if (adjustPurchases) {
                                    if (!Ember.isEmpty(purchases) && !Ember.isEmpty(inventoryPurchases)) {
                                        //Loop through purchase(s) on request and adjust corresponding inventory purchases
                                        purchases.forEach(function(purchaseInfo) {
                                            this._adjustPurchase(inventoryPurchases, purchaseInfo.id, purchaseInfo.quantity, increment);
                                        }.bind(this));
                                    }
                                } 
                            }.bind(this));
                        }
                        if (!Ember.isEmpty(inventoryPurchases)) {
                            row = this._calculateCosts(inventoryPurchases, row);   
                            beginningBalance += this._getValidNumber(row.totalCost);
                        }
                    }.bind(this));
                    if (beginningBalance < 0) {
                        this.get('reportRows').addObject(['Beginning Balance', '', '('+this._numberFormat(beginningBalance)+')']);  
                    } else {
                        this.get('reportRows').addObject(['Beginning Balance', '', this._numberFormat(beginningBalance)]);  
                    }
                    resolve(beginningBalance);
                }.bind(this), reject);
            }.bind(this), reject);
        }.bind(this));
    },
    
    _generateInventoryReport: function() {
        this.set('grandCost', 0);
        this.set('grandQuantity', 0);
        this.set('locationSummary', []);
        var dateDiff,            
            locationSummary = this.get('locationSummary'),
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
                    if (!Ember.isEmpty(inventoryPurchases)) {
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
                    }

                    if(!Ember.isEmpty(inventoryRequests)) {
                        inventoryRequests.forEach(function(request) {
                            var adjustPurchases = request.adjustPurchases,
                                increment = false,
                                locations = request.locationsAffected,
                                purchases = request.purchasesAffected,
                                transactionType = request.transactionType;


                            increment = (transactionType === 'Adjustment (Add)' || transactionType === 'Return');
                            if (adjustPurchases) {
                                if (!Ember.isEmpty(purchases) && !Ember.isEmpty(inventoryPurchases)) {
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
                            if (!Ember.isEmpty(inventoryRequests) && this._hasIncludedLocation(row.locations)) {
                                var consumedQuantity = inventoryRequests.reduce(function(previousValue, request) {
                                    if (request.transactionType === 'Fulfillment') {
                                        return previousValue += this._getValidNumber(request.quantity);
                                    } else {
                                        return previousValue;
                                    }
                                }.bind(this), 0);
                                row.quantity = this._getValidNumber(item.quantity);
                                if (consumedQuantity > 0) {
                                    row.consumedPerDay = this._numberFormat((consumedQuantity/dateDiff), true);
                                    row.daysLeft = this._numberFormat(row.quantity/row.consumedPerDay);
                                } else {
                                    if (consumedQuantity ===0) {
                                        row.consumedPerDay = '0';
                                    } else {
                                        row.consumedPerDay = '?'+consumedQuantity;                                        
                                    }
                                    row.daysLeft = '?';
                                }
                                this._addReportRow(row);
                            }
                            break;
                        }   
                        case 'detailedAdjustment': 
                        case 'detailedTransfer':                            
                        case 'detailedUsage': 
                        case 'detailedExpense': 
                        case 'summaryExpense': {
                            if (!Ember.isEmpty(inventoryRequests)) {
                                inventoryRequests.forEach(function(request) { 
                                    if (this._includeTransaction(reportType, request.transactionType) && this._hasIncludedLocation(request.locationsAffected)) {
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
                                        var reportRow = {                                            
                                            date: moment(new Date(request.dateCompleted)).format('l'),
                                            expenseAccount: request.expenseAccount,
                                            giftInKind: row.giftInKind,
                                            inventoryItem: row.inventoryItem,
                                            quantity: request.quantity,
                                            transactionType: request.transactionType,
                                            locations: locations,
                                            unitCost: request.costPerUnit,
                                            totalCost: totalCost
                                        };                                        
                                        if (reportType === 'detailedExpense' || reportType === 'summaryExpense') {
                                            this._updateExpenseMap(request, reportRow);
                                        } else {
                                            this._addReportRow(reportRow);
                                            summaryQuantity += this._getValidNumber(request.quantity);
                                            summaryCost += this._getValidNumber(totalCost);
                                        }
                                    }
                                }.bind(this));
                                if (reportType !== 'detailedExpense' && reportType !== 'summaryExpense') {
                                    this._addTotalsRow('Subtotal: ', summaryCost, summaryQuantity);
                                    this.incrementProperty('grandCost', summaryCost);
                                    this.incrementProperty('grandQuantity', summaryQuantity);
                                }
                            }
                            break;
                        }
                        case 'summaryTransfer':
                        case 'summaryUsage': {
                            if (!Ember.isEmpty(inventoryRequests) && this._hasIncludedLocation(row.locations)) {
                                row.quantity = inventoryRequests.reduce(function(previousValue, request) {
                                    if (this._includeTransaction(reportType, request.transactionType)) {
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
                                    this.incrementProperty('grandCost', summaryCost);
                                    this.incrementProperty('grandQuantity', row.quantity);
                                }
                            }
                            break;
                        }
                        case 'detailedPurchase': {
                            if (!Ember.isEmpty(inventoryPurchases)) {
                                inventoryPurchases.forEach(function(purchase) {
                                    if (this._includeLocation(purchase.location)) {
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
                                    }
                                }.bind(this));
                                this._addTotalsRow('Subtotal: ',summaryCost, summaryQuantity);
                                this.incrementProperty('grandCost', summaryCost);
                                this.incrementProperty('grandQuantity', summaryQuantity);
                            }
                            break;
                        }
                        case 'summaryPurchase': {
                            if (!Ember.isEmpty(inventoryPurchases)) {
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
                                if (this._hasIncludedLocation(row.locations)) {
                                    row.unitCost = (summaryCost/row.quantity);
                                    row.totalCost = summaryCost;
                                    this._addReportRow(row);
                                    this.incrementProperty('grandCost', summaryCost);
                                    this.incrementProperty('grandQuantity', row.quantity);
                                }
                            }
                            break;
                        }                                        
                        case 'valuation': {
                            if (!Ember.isEmpty(inventoryPurchases) && this._hasIncludedLocation(row.locations)) {
                                this._calculateCosts(inventoryPurchases, row);
                                this.incrementProperty('grandCost', this._getValidNumber(row.totalCost));
                                this.incrementProperty('grandQuantity', this._getValidNumber(row.quantity));
                                this._addReportRow(row);
                            }
                            break;
                        }
                    }
                }.bind(this));
                switch (reportType) {                    
                    case 'detailedExpense': 
                    case 'summaryExpense': {
                        this._finishExpenseReport(reportType);
                        break;
                    }
                    case 'byLocation': {
                        this._finishLocationReport();
                        this._addTotalsRow('Total: ', this.get('grandCost'), this.get('grandQuantity'));
                        break;
                    }
                    default: {
                        this._addTotalsRow('Total: ', this.get('grandCost'), this.get('grandQuantity'));
                    }
                }                 
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
            endTime = moment(endDate).endOf('day').toDate().getTime();
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
    
    /**
     * Pull the warehouse name out of a formatted location name that (may) include the aisle location
     * @param {string} locationName the formatted location name.
     * @return {string} the warehouse name.
     */
    _getWarehouseLocationName: function(locationName) {
        var returnLocation = '';
        if (locationName.indexOf(':') > -1) {
            returnLocation = locationName.split(':')[0].trim();
        } else {
            returnLocation = locationName;
        }
        return returnLocation;
    },
    
    /**
     * Determines if any of the passed in location objects match the currently filtered location
     * @param {array} locations list of location objects to check.
     * @return {boolean} true if any of the locations match the filter; otherwise false.
     */
    _hasIncludedLocation: function(locations) {
        var hasIncludedLocation = false;
        locations.forEach(function(location) {
            var locationName = this._getWarehouseLocationName(location.name);
            if (this._includeLocation(locationName)) {
                hasIncludedLocation = true;
            }
        }.bind(this));
        return hasIncludedLocation;
    },
    
    
    /**
     * Determine if the specified location should be included in the report
     * @param {string} location the location to check for inclusion
     * @return {boolean} true if the location should be included.
     */
    _includeLocation: function(location) {
        var filterLocation = this.get('filterLocation');
        return Ember.isEmpty(filterLocation) || location === filterLocation;        
    },
    
    /**
     * Given a report type and a transaction type determine if the transaction should 
     * be included in the report.
     * @param {string} reportType the report type
     * @param {string} transactionType the transaction type
     * @return {boolean} true if the transaction should be included.
     */
    _includeTransaction: function(reportType, transactionType) {
        var detailed = (reportType.indexOf('detailed') === 0),
            includeForReportType;
        if (reportType === 'detailedExpense' || reportType === 'summaryExpense') {
            return true;
        }
        switch (transactionType) {
            case 'Fulfillment': {
                if (detailed) {
                    includeForReportType = 'detailedUsage';
                } else {
                    includeForReportType = 'summaryUsage';
                }
                break;
            }
            case 'Transfer': {
                if (detailed) {
                    includeForReportType = 'detailedTransfer';
                } else {
                    includeForReportType = 'summaryTransfer';
                }
                break;                
            }
            default: {
                if (detailed) {
                    includeForReportType = 'detailedAdjustment';
                } else {
                    includeForReportType = 'summaryAdjustment';
                }
            }
        }
        return (reportType === includeForReportType);
    },
    
    _updateExpenseMap: function(request, reportRow) {
        var categoryToUpdate,
            expenseAccountToUpdate,
            expenseMap = this.get('expenseMap'),
            isGiftInKind = (reportRow.giftInKind === 'Y'),
            increment = true,
            transactionValue;
                
        switch (request.transactionType) {
            case 'Fulfillment': 
            case 'Return': {               
                if (isGiftInKind) {
                    categoryToUpdate = expenseMap['Gift In Kind Usage'];
                } else {
                    categoryToUpdate = expenseMap['Inventory Consumed'];
                }
                if (request.transactionType  === 'Return') {
                    increment = false;
                }
                break;
                
            }
            case 'Adjustment (Add)': 
            case 'Adjustment (Remove)': 
            case 'Return To Vendor':
            case 'Write Off': {     
                categoryToUpdate = expenseMap['Inventory Obsolence'];
                if (request.transactionType === 'Adjustment (Add)') {
                    increment = false;
                }
                break;
            }           
        }
        if (!Ember.isEmpty(categoryToUpdate)) {
            expenseAccountToUpdate = categoryToUpdate.expenseAccounts.findBy('name',request.expenseAccount);
            if (Ember.isEmpty(expenseAccountToUpdate)) {                
                expenseAccountToUpdate = {
                    name: request.expenseAccount,
                    total: 0,
                    reportRows: []
                };
                categoryToUpdate.expenseAccounts.push(expenseAccountToUpdate);
            }
            expenseAccountToUpdate.reportRows.push(reportRow);
            transactionValue = (this._getValidNumber(request.quantity) * this._getValidNumber(request.costPerUnit)); 
            if (increment) {
                categoryToUpdate.total += transactionValue;                
                expenseAccountToUpdate.total += transactionValue;                
            } else {
                categoryToUpdate.total = categoryToUpdate.total - transactionValue; 
                expenseAccountToUpdate.total = expenseAccountToUpdate.total - transactionValue;
                reportRow.totalCost = (reportRow.totalCost * -1);
            }
            
            
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
            this.showProgressModal();
            switch (reportType) {
                case 'expiration': {
                    this._generateExpirationReport();
                    break;                    
                }
                case 'summaryFinance': {
                    this._generateFinancialSummaryReport();
                    break;
                }
                case 'detailedExpense':
                case 'summaryExpense': {                    
                    var expenseCategories = this.get('expenseCategories'),
                        expenseMap = {};
                    expenseCategories.forEach(function(category) {
                        expenseMap[category] = {
                            total: 0,
                            expenseAccounts: []
                        };
                    });
                    this.set('expenseMap', expenseMap);                    
                    this._generateInventoryReport();
                    break;                    
                }
                default: {
                    this._generateInventoryReport();
                    break;
                }
            }
        },
        
        viewInventory: function(id) {
            this.store.find('inventory', id).then(function(item) {
                item.set('returnTo', 'inventory.reports');                
                this.transitionToRoute('inventory.edit', item);
            }.bind(this));
        }
    }
});