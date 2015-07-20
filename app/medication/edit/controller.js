import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";
import InventorySelection from 'hospitalrun/mixins/inventory-selection';
import PatientId from 'hospitalrun/mixins/patient-id';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import UserSession from "hospitalrun/mixins/user-session";

export default AbstractEditController.extend(InventorySelection, PatientId, PatientSubmodule, UserSession, {    
    needs: ['application','medication','pouchdb'],    
    
    applicationConfigs: Ember.computed.alias('controllers.application.model'),
    expenseAccountList: Ember.computed.alias('controllers.medication.expenseAccountList'),
    
    canFulfill: function() {
        return this.currentUserCan('fulfill_medication');
    }.property(),
    
    isFulfilled: function() {
        var status = this.get('status');
        return (status === 'Fulfilled');
    }.property('status'),
    
    isFulfilling: function() {
        var canFulfill = this.get('canFulfill'),
            isRequested = this.get('isRequested'),
            fulfillRequest = this.get('shouldFulfillRequest'),
            isFulfilling = canFulfill && (isRequested || fulfillRequest);
        this.get('model').set('isFulfilling', isFulfilling);
        return isFulfilling;
    }.property('canFulfill','isRequested', 'shouldFulfillRequest'),
    
    isFulfilledOrRequested: function() {
        return (this.get('isFulfilled') || this.get('isRequested'));
    }.property('isFulfilled','isRequested'),
    
    prescriptionClass: function() {
        var quantity = this.get('quantity');
        this.get('model').validate();
        if (Ember.isEmpty(quantity)) {
            return 'required';
        }
    }.property('quantity'),
    
    quantityClass: function() {
        var prescription = this.get('prescription'),
            returnClass = 'col-xs-3',
            isFulfilling = this.get('isFulfilling');
        if (isFulfilling || Ember.isEmpty(prescription)) {
            returnClass += ' required';
        }
        return returnClass;
    }.property('isFulfilling', 'prescription'),
    
    quantityLabel: function() {
        var returnLabel = "Quantity Requested",
            isFulfilled = this.get('isFulfilled'),
            isFulfilling = this.get('isFulfilling');
        if (isFulfilling) {
            returnLabel = "Quantity Dispensed";
        } else if (isFulfilled) {
            returnLabel = "Quantity Distributed";
        }
        return returnLabel;
    }.property('isFulfilled'),

    medicationList: [],
    updateCapability: 'add_medication',

    afterUpdate: function() {
        var alertTitle = 'Medication Request Saved',
            alertMessage = 'The medication record has been saved.',
            isFulfilled = this.get('isFulfilled');
        if (isFulfilled) {
            alertTitle = 'Medication Request Fulfilled';
            alertMessage = 'The medication request has been fulfilled.';
            this.set('selectPatient', false);
        } else {
            alertTitle = 'Medication Request Saved';
            alertMessage = 'The medication record has been saved.';
        }
        this.saveVisitIfNeeded(alertTitle, alertMessage);
    },
    
    _addNewPatient: function() {        
        this._getNewPatientId().then(function(friendlyId) {
            var patientTypeAhead = this.get('patientTypeAhead'),
                nameParts = patientTypeAhead.split(' '),
                patientDetails = {
                    friendlyId: friendlyId,
                    patientFullName: patientTypeAhead,
                    requestingController: this
                },
                patient;
            if (nameParts.length >= 3) {
                patientDetails.firstName = nameParts[0];
                patientDetails.middleName = nameParts[1];            
                patientDetails.lastName = nameParts.splice(2, nameParts.length).join(' ');
            } else if (nameParts.length === 2) {
                patientDetails.firstName = nameParts[0];
                patientDetails.lastName = nameParts[1];                        
            } else {
                patientDetails.firstName = patientTypeAhead;
            }
            patient = this.store.createRecord('patient', patientDetails);
            this.send('openModal', 'patients.quick-add', patient);        
        }.bind(this));
    },
    
    _getNewPatientId: function() {
        var newPatientId = this.get('newPatientId');
        if (Ember.isEmpty(newPatientId)) {
            return new Ember.RSVP.Promise(function(resolve, reject){
                var configs = this.get('applicationConfigs');
                this.generateFriendlyId(configs).then(function(friendlyId) {
                    this.set('newPatientId', friendlyId);
                    resolve(friendlyId);
                }.bind(this), reject);    
            }.bind(this));
        } else {
            return Ember.RSVP.resolve(newPatientId);
        }
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
                            if (Ember.isEmpty(newMedication.get('patient'))) {
                                this._addNewPatient();
                                reject('creating new patient first');
                            } else {
                                this.set('newMedication', true);
                                this.set('status', 'Requested');
                                this.set('requestedBy', newMedication.getUserName());
                                this.set('requestedDate', new Date());
                                this.addChildToVisit(newMedication, 'medication', 'Pharmacy').then(function() {        
                                    this.finishBeforeUpdate(isFulfilling,  resolve);
                                }.bind(this), reject);
                            }
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
                    expenseAccount: this.get('expenseAccount'),
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
    
    showUpdateButton: function() {        
        var isFulfilled = this.get('isFulfilled');
        if (isFulfilled) {
            return false;
        } else {
            return this._super();
        }
    }.property('updateCapability', 'isFulfilled'),
    
    updateButtonText: function() {
        if (this.get('hideFulfillRequest')) {
            return 'Dispense';
        } else if (this.get('isFulfilling')) {
            return 'Fulfill';
        } else if (this.get('isNew')) {
            return 'Add';
        } else {
            return 'Update';
        }
    }.property('isNew', 'isFulfilling'),
    
    actions: {
        addedNewPatient: function(record) {
            this.send('closeModal');
            this.set('patient', record);
            this.set('newPatientId');
            this.send('update');
        }
    }

});