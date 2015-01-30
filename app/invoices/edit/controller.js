import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import NumberFormat from "hospitalrun/mixins/number-format";
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import PublishStatuses from 'hospitalrun/mixins/publish-statuses';

export default AbstractEditController.extend(NumberFormat, PatientSubmodule, PublishStatuses, {
    needs: ['pouchdb'],
    pharmacyCharges: [],
    pharmacyTotal: 0,
    supplyCharges: [],
    supplyTotal: 0,
    updateCapability: 'add_invoice',
    wardCharges: [],
    wardTotal: 0,
    
    canAddCharge: function() {        
        return this.currentUserCan('add_charge');
    }.property(),
    
    actions: {
        addLineItem: function(lineItem) {
            var lineItems = this.get('lineItems');
            lineItems.addObject(lineItem);
            this.send('update', true);
            this.send('closeModal');            
        },
        
        deleteCharge: function(deleteInfo) {
            deleteInfo.deleteFrom.removeObject(deleteInfo.itemToDelete);
            this.send('update', true);
            this.send('closeModal');
        },        
        
        deleteLineItem: function(deleteInfo) {
            var lineItems = this.get('lineItems');
            lineItems.removeObject(deleteInfo.itemToDelete);
            deleteInfo.itemToDelete.destroyRecord();
            this.send('update', true);
            this.send('closeModal');
        },
        
        showAddLineItem: function() {
            var newLineItem = this.store.createRecord('billing-line-item', {});
            this.send('openModal','invoices.add-line-item', newLineItem);
        },
    },
    
    lineItemsByCategory: function() {
        var lineItems = this.get('lineItems'),
            byCategory = [];
        lineItems.forEach(function(lineItem) {
            var category = lineItem.get('category'),
                categoryList = byCategory.findBy('category', category);
            if (Ember.isEmpty(categoryList)) {
                categoryList = {
                    amountOwed: 0,
                    category: category,
                    discount: 0,
                    items: [],
                    nationalInsurance: 0,
                    privateInsurance: 0,
                    total: 0
                };                
                byCategory.push(categoryList);
            }
            categoryList.amountOwed += this._getValidNumber(lineItem.get('amountOwed'));
            categoryList.discount += this._getValidNumber(lineItem.get('discount'));
            categoryList.nationalInsurance += this._getValidNumber(lineItem.get('nationalInsurance'));
            categoryList.privateInsurance += this._getValidNumber(lineItem.get('privateInsurance'));
            categoryList.total += this._getValidNumber(lineItem.get('total'));
            categoryList.items.push(lineItem);
        }.bind(this));
        return byCategory;        
    }.property('lineItems.@each.amountOwed'),
    
    visitChanged: function() {
        var visit = this.get('visit'),
            lineItems = this.get('lineItems');
        if (!Ember.isEmpty(visit) && Ember.isEmpty(lineItems)) {
            var promises = this.resolveVisitChildren();            
            Ember.RSVP.allSettled(promises, 'Resolved visit children before generating invoice').then(function(results) {
                var chargePromises = [];
                results.forEach(function(result) {
                    if (!Ember.isEmpty(result.value)) {
                        result.value.forEach(function(record) {
                            var charges = record.get('charges');
                            if (!Ember.isEmpty(charges)) {                            
                                charges.forEach(function(charge) {
                                    //Make sure charges are fully resolved (including pricingItem)
                                    chargePromises.push(charge.reload());
                                });
                            }
                        });
                    }
                });
                if (!Ember.isEmpty(chargePromises)) {
                    var promiseLabel = 'Reloaded charges before generating invoice';
                    Ember.RSVP.allSettled(chargePromises, promiseLabel).then(function() {
                        this._generateLineItems(visit, results);
                    }.bind(this));
                } else {
                    this._generateLineItems(visit, results);
                }
            }.bind(this), function(err) {
                console.log('Error resolving visit children', err);
            });
        }
    }.observes('visit'),
    
    _addPharmacyCharge: function(charge, medicationItemName) {
        var medicationItem = charge.get(medicationItemName),
            pharmacyCharges = this.get('pharmacyCharges'),        
            pharmacyCharge = {
                name: medicationItem.get('name'),
                quantity: charge.get('quantity'),
                price: medicationItem.get('price'),
                department: 'Pharmacy'
            };
        pharmacyCharges.addObject(pharmacyCharge);
        if (pharmacyCharge.price && !isNaN(pharmacyCharge.price)) {
            this.incrementProperty('pharmacyTotal', (pharmacyCharge.price * pharmacyCharge.quantity));
        }
    },
    
    _addSupplyCharge: function(charge, department) {
        var supplyCharges = this.get('supplyCharges'),
            supplyCharge = this._createChargeItem(charge, department, 'supplyTotal');
        supplyCharges.addObject(supplyCharge);
    },
    
    _createChargeItem: function(charge, department, totalProperty) {
        var chargeItem = {
                name: charge.get('pricingItem.name'),
                quantity: charge.get('quantity'),
                price: charge.get('pricingItem.price'),
                department: department
            };        
        if (chargeItem.price && !isNaN(chargeItem.price)) {
            this.incrementProperty(totalProperty, (chargeItem.price * chargeItem.quantity));
        }
        return chargeItem;
    },
    
    _mapWardCharge: function(charge) {
        return this._createChargeItem(charge, 'Ward', 'wardTotal');
    },
    
    _completeBeforeUpdate: function(sequence, resolve, reject) {
        var invoiceId = 'inv',
            sequenceValue;
        sequence.incrementProperty('value',1);
        sequenceValue = sequence.get('value');
        if (sequenceValue < 100000) {
            invoiceId += String('00000' + sequenceValue).slice(-5);
        } else {
            invoiceId += sequenceValue;
        }
        this.set('id',invoiceId);
        sequence.save().then(resolve, reject);
    },
        
    _generateLineItems: function(visit, visitChildren) {
        var endDate = visit.get('endDate'),
            imaging = visitChildren[0].value,
            labs = visitChildren[1].value,
            lineItem,
            lineItems = this.get('lineItems'),
            medication = visitChildren[2].value,
            procedures = visitChildren[3].value,
            startDate = visit.get('startDate'),
            visitCharges = visit.get('charges');
        if (!Ember.isEmpty(endDate) && !Ember.isEmpty(startDate)) {
            endDate = moment(endDate);
            startDate = moment(startDate);
            var stayDays = endDate.diff(startDate, 'days');
            if (stayDays > 1) {
                lineItem = this.store.createRecord('billing-line-item', {
                    category: 'Hospital Charges',
                    name: 'Room/Accomodation',
                    details: [{
                        name: 'Days',
                        quantity: stayDays
                    }]
                });
                lineItem.save();
                lineItems.addObject(lineItem);
            }
        }
        
        medication.forEach(function(medicationItem) {
            this._addPharmacyCharge(medicationItem, 'inventoryItem');
        }.bind(this));
 
        this.set('wardCharges', visitCharges.map(this._mapWardCharge.bind(this)));            
        
        procedures.forEach(function(procedure) {
            var charges = procedure.get('charges');
            charges.forEach(function(charge) {
                if (charge.get('medicationCharge')) {
                    this._addPharmacyCharge(charge, 'medication');
                } else {
                    this._addSupplyCharge(charge, 'O.R.');
                }
            }.bind(this));
        }.bind(this));
        
        labs.forEach(function(lab) {
            if (!Ember.isEmpty(imaging.get('labType'))) {
                this._addSupplyCharge(Ember.Object.create({
                    pricingItem: imaging.get('labType'),
                    quantity: 1
                }), 'Lab');
            }
            lab.get('charges').forEach(function(charge) {                
                this._addSupplyCharge(charge, 'Lab');
            }.bind(this));
        }.bind(this));
        
        imaging.forEach(function(imaging) {
            if (!Ember.isEmpty(imaging.get('imagingType'))) {
                this._addSupplyCharge(Ember.Object.create({
                    pricingItem: imaging.get('imagingType'),
                    quantity: 1
                }), 'Imaging');
            }
            imaging.get('charges').forEach(function(charge) {
                this._addSupplyCharge(charge, 'Imaging');
            }.bind(this));
        }.bind(this));
        
        lineItem = this.store.createRecord('billing-line-item', {
            name: 'Pharmacy',
            category: 'Hospital Charges',
            total: this.get('pharmacyTotal'),
            details: this.get('pharmacyCharges')
        });
        lineItem.save();
        lineItems.addObject(lineItem);
        
        lineItem = this.store.createRecord('billing-line-item', {
            name: 'X-ray/Lab/Supplies',
            category: 'Hospital Charges',
            total: this.get('supplyTotal'),
            details: this.get('supplyCharges')
        });
        lineItem.save();
        lineItems.addObject(lineItem);
        
        lineItem = this.store.createRecord('billing-line-item', {
            name: 'Others/Misc',
            category: 'Hospital Charges',
            total: this.get('wardTotal'),
            details: this.get('wardCharges')
        });
        lineItem.save();
        lineItems.addObject(lineItem);
        this.send('update', true);
    },
    
    beforeUpdate: function() {
        if (this.get('isNew')) {            
            return new Ember.RSVP.Promise(function(resolve, reject){
                this.store.find('sequence', 'invoice').then(function(sequence) {
                    this._completeBeforeUpdate(sequence, resolve, reject);
                }.bind(this), function() {
                    var newSequence = this.get('store').push('sequence',{
                        id: 'invoice',
                        value: 0
                    });
                    this._completeBeforeUpdate(newSequence, resolve, reject);
                }.bind(this));
            }.bind(this));
        } else {
            return Ember.RSVP.Promise.resolve();
        }
    },    

    afterUpdate: function(record) {
        var message =  'The invoice record has been saved.'.fmt(record.get('displayName'));
        this.displayAlert('Invoice Saved', message);        
    }
});
