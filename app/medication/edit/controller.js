import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from "ember";
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';
import UserSession from "hospitalrun/mixins/user-session";

export default AbstractEditController.extend(PatientSubmodule, UserSession, {    
    needs: 'medication',

    canFulfill: function() {
        return this.currentUserCan('fulfill_medication');
    }.property(),

    durationTypes: [
        'Days',
        'Weeks'
    ],
    
    isFulfilling: function() {
        var canFulfill = this.get('canFulfill'),
            isRequested = this.get('isRequested'),
            fulfillRequest = this.get('shouldFulfillRequest');
        return canFulfill && (isRequested || fulfillRequest);
    }.property('canFulfill','isRequested', 'shouldFulfillRequest'),

    isRequested: function() {
        var status = this.get('status');
        return (status === 'Requested');
    }.property('status'),

    lookupListsToUpdate: [{
        name: 'medicationFrequencyList', //Name of property containing lookup list
        property: 'frequency', //Corresponding property on model that potentially contains a new value to add to the list
        id: 'medication_frequency' //Id of the lookup list to update
    }],

    medicationList: Ember.computed.alias('controllers.medication.medicationList'),
    medicationFrequencyList: Ember.computed.alias('controllers.medication.medicationFrequencyList'),
    patientList: Ember.computed.alias('controllers.medication.patientList'),
    visitList: Ember.computed.alias('controllers.medication.visitList'),
    updateCapability: 'add_medication',

    afterUpdate: function() {
        this.send(this.get('cancelAction'));
    },
    
    beforeUpdate: function() {
        var isFulfilling = this.get('isFulfilling'),
            isNew = this.get('isNew');
        if (isNew || isFulfilling) {
            return new Ember.RSVP.Promise(function(resolve, reject){
                var newMedication = this.get('model');
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