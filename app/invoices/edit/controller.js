import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import PublishStatuses from 'hospitalrun/mixins/publish-statuses';

export default AbstractEditController.extend(PatientSubmodule, PublishStatuses, {
    needs: ['pouchdb'],
    pharmacyCharges: [],
    pharmacyTotal: 0,
    supplyCharges: [],
    supplyTotal: 0,
    updateCapability: 'add_invoice',
    wardCharges: [],
    wardTotal: 0,
    
    visitChanged: function() {
        var visit = this.get('visit'),
            lineItems = this.get('lineItems');
        if (!Ember.isEmpty(visit) && Ember.isEmpty(lineItems)) {
            var promises = this.resolveVisitChildren();            
            Ember.RSVP.all(promises, 'Resolved visit children before generating invoice').then(function() {
                this._generateLineItems(visit);
            }.bind(this));
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
        if (pharmacyCharge.price && isNaN(pharmacyCharge.price)) {
            this.incrementProperty('pharmacyTotal', pharmacyCharge.price);
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
        if (chargeItem.price && isNaN(chargeItem.price)) {
            this.incrementProperty(totalProperty, chargeItem.price);
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
    
    _generateLineItems: function(visit) {
        var endDate = visit.get('endDate'),
            imaging = visit.get('imaging'),
            labs = visit.get('labs'),
            lineItems = this.get('lineItems'),
            medication = visit.get('medication'),
            procedures = visit.get('procedures'),
            startDate = visit.get('startDate'),
            visitCharges = visit.get('charges');
        if (!Ember.isEmpty(endDate) && !Ember.isEmpty(startDate)) {
            endDate = moment(endDate);
            startDate = moment(startDate);
            var stayDays = endDate.diff(startDate, 'days');
            if (stayDays > 1) {
                var lineItem = this.store.createRecord('billing-line-item', {
                    name: 'Room/Accomodation',
                    description: stayDays +' days'
                });
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
            lab.get('charges').forEach(function(charge) {                
                this._createChargeItem(charge, 'Lab', 'supplyTotal');
            }.bind(this));
        }.bind(this));
        
        imaging.forEach(function(imaging) {
            imaging.get('charges').forEach(function(charge) {
                this._createChargeItem(charge, 'Imaging', 'supplyTotal');
            }.bind(this));
        }.bind(this));
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
