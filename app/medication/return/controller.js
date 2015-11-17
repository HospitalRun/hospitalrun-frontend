import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import FulfillRequest from 'hospitalrun/mixins/fulfill-request'; 
import InventoryLocations from 'hospitalrun/mixins/inventory-locations'; //inventory-locations mixin is needed for fulfill-request mixin!
import InventorySelection from 'hospitalrun/mixins/inventory-selection';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(FulfillRequest, InventoryLocations, InventorySelection, PatientSubmodule, {    
    needs: ['medication','pouchdb'],

    lookupListsToUpdate: [{
        name: 'aisleLocationList', //Name of property containing lookup list
        property: 'aisleLocation', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'aisle_location_list' //Id of the lookup list to update
    }, {
        name: 'expenseAccountList', //Name of property containing lookup list
        property: 'expenseAccount', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'expense_account_list' //Id of the lookup list to update
    }, {
        name: 'warehouseList', //Name of property containing lookup list
        property: 'location', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'warehouse_list' //Id of the lookup list to update
    }],    

    aisleLocationList: Ember.computed.alias('controllers.medication.aisleLocationList'),
    expenseAccountList: Ember.computed.alias('controllers.medication.expenseAccountList'),
    warehouseList: Ember.computed.alias('controllers.medication.warehouseList'), 
    updateCapability: 'add_medication',
    
    medicationChanged: function() {
        var medication = this.get('medication');
        if (!Ember.isEmpty(medication)) {
            var inventoryItem = medication.get('inventoryItem');
            this.set('inventoryItemTypeAhead', '%@ - %@'.fmt(inventoryItem.get('name'), inventoryItem.get('friendlyId')));
            this.set('inventoryItem', inventoryItem);            
            //this.set('inventoryItemTypeAhead', medication.get('inventoryItem.name'));            
        } else {
            this.set('inventoryItem');
        }
        Ember.run.later(function() {
            this.get('model').validate();
        }.bind(this));
    }.observes('medication'),
    
    patientVisitsChanged: function() {
        var patientVisits = this.get('patientVisits');
        if (!Ember.isEmpty(patientVisits)) {
            this.set('visit', patientVisits.get('firstObject'));
        }
    }.observes('patientVisits'),
    
    showPatientMedicationList: function() {
        var patientMedication = this.get('patientMedication');        
        return !Ember.isEmpty(patientMedication);
    }.property('patientMedication'),
    
    setPatientMedicationList: function() {
        var visit = this.get('visit');
        if (!Ember.isEmpty(visit)) {
            visit.get('medication').then(function(medication) {
                medication = medication.filterBy('status','Fulfilled');
                this.set('patientMedication', medication);
                this.set('medication', medication.get('firstObject'));
            }.bind(this));
        } else {
            this.set('patientMedication');
        }
    }.observes('patient','visit'),
    
    _finishUpdate: function() {
        var aisle = this.get('deliveryAisle'),
            location = this.get('deliveryLocation'),
            inventoryItem = this.get('inventoryItem'),
            //find location on inventoryItem
            inventoryLocation = this._findOrCreateLocation(inventoryItem, location, aisle);
        this.set('adjustPurchases', true);
        this.set('inventoryLocations',[inventoryLocation]);            
        this.set('markAsConsumed',true);
        //Make sure inventory item is resolved first.
        this.get('inventoryItem').then(function() {
            this.send('fulfillRequest', this.get('model'), false, true, true);
        }.bind(this));
    },
    
    actions: {        
        doneFulfillRequest: function() {
            this.updateLookupLists();
            this.displayAlert('Medication Returned', 'The medication has been marked as returned.', 'allItems');            
        },
        update: function() {            
            var medication = this.get('medication'),
                quantity = this.get('quantity');                
            if (!Ember.isEmpty(medication)) {
                medication.reload().then(function() {
                    medication.decrementProperty('quantity', quantity);
                    if (medication.get('quantity') < 0) {
                        medication.set('quantity', 0);
                    }
                    medication.save().then(this._finishUpdate.bind(this));
                }.bind(this));
            } else {
                this._finishUpdate();
            }
        }
    },
    
    updateButtonText: 'Return Medication'
});