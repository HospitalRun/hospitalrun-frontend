import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";
import InventorySelection from 'hospitalrun/mixins/inventory-selection';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import UserSession from "hospitalrun/mixins/user-session";

export default AbstractEditController.extend(InventorySelection, PatientSubmodule, UserSession, {    
    needs: ['medication','pouchdb'],

    canFulfill: function() {
        return this.currentUserCan('fulfill_medication');
    }.property(),
    
    isFulfilling: function() {
        var canFulfill = this.get('canFulfill'),
            isRequested = this.get('isRequested'),
            fulfillRequest = this.get('shouldFulfillRequest'),
            isFulfilling = canFulfill && (isRequested || fulfillRequest);
        this.get('model').set('isFulfilling', isFulfilling);
        return isFulfilling;
    }.property('canFulfill','isRequested', 'shouldFulfillRequest'),
    
    quantityClass: function() {
        var returnClass = 'col-xs-3',
            isFulfilling = this.get('isFulfilling');
        if (isFulfilling) {
            returnClass += ' required';
        }
        return returnClass;
    }.property('isFulfilling'),

    medicationList: [],
    updateCapability: 'add_medication',

    afterUpdate: function() {
        var alertTitle = 'Medication Request Saved',
            alertMessage = 'The medication record has been saved.'; 
        this.saveVisitIfNeeded(alertTitle, alertMessage);
    },
    
    beforeUpdate: function() {
        var isFulfilling = this.get('isFulfilling'),
            isNew = this.get('isNew');
        if (isNew || isFulfilling) {
            return new Ember.RSVP.Promise(function(resolve, reject){
                var newMedication = this.get('model');
                newMedication.validate().then(function() {
                    if (newMedication.get('isValid')) {
                        if (isNew) {
                            this.set('newMedication', true);
                            this.set('status', 'Requested');
                            this.set('requestedBy', newMedication.getUserName());
                            this.set('requestedDate', new Date());
                            this.addChildToVisit(newMedication, 'medication', 'Pharmacy').then(function() {        
                                this.finishBeforeUpdate(isFulfilling,  resolve);
                            }.bind(this), reject);
                        } else {
                            this.finishBeforeUpdate(isFulfilling,  resolve);
                        }                        
                    } else {
                        this.send('showDisabledDialog');
                        reject('invalid model');                        
                    }
                }.bind(this)).catch(function() {
                    this.send('showDisabledDialog');
                    reject('invalid model');                    
                }.bind(this));
            }.bind(this));
        } else {
            return Ember.RSVP.resolve();
        }
    },
    
    finishBeforeUpdate: function(isFulfilling, resolve) {
        if (isFulfilling) {
            var inventoryLocations = this.get('inventoryLocations'),
                inventoryRequest = this.get('store').createRecord('inv-request', {
                    dateCompleted: new Date(),
                    inventoryItem: this.get('inventoryItem'),
                    inventoryLocations: inventoryLocations,
                    quantity: this.get('quantity'),
                    transactionType: 'Fulfillment',
                    patient: this.get('patient'),
                    markAsConsumed: true
                });            
            this.send('fulfillRequest', inventoryRequest, false, false, true);
            this.set('status','Fulfilled');
            resolve();
        } else {
            resolve();
        }
    },
    
    updateButtonText: function() {
        if (this.get('isFulfilling')) {
            return 'Fulfill';
        } else if (this.get('isNew')) {
            return 'Add';
        } else {
            return 'Update';
        }
    }.property('isNew', 'isFulfilling'),

});