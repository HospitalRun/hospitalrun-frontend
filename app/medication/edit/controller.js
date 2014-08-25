import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';    
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(PatientSubmodule, {
    needs: 'medication',

    durationTypes: [
        'Days',
        'Weeks'
    ],
    
    isFulfilling: function() {
        var isRequested = this.get('isRequested'),
            fulfillRequest = this.get('shouldFulfillRequest');
        return isRequested || fulfillRequest;
    }.property('isRequested', 'shouldFulfillRequest'),

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
    patientVisits: Ember.computed.alias('patient.visits'),

    afterUpdate: function() {
        this.send(this.get('cancelAction'));
    },
    
    beforeUpdate: function() {
        var isFulfilling = this.get('isFulfilling'),
            isNew = this.get('isNew');
        if (isNew || isFulfilling) {
            return new Ember.RSVP.Promise(function(resolve, reject){
                var medication = this.get('model'),
                    visit = this.get('visit'),
                    patient = this.get('patient'),
                    patientVisits = this.get('patientVisits'),
                    promises = [];
                if (isNew) {
                    this.set('newMedication', true);
                    this.set('status', 'Requested');
                    this.set('requestedBy', medication.getUserName());
                    if (Ember.isEmpty(visit)) {
                        visit = this.get('store').createRecord('visit', {
                            startDate: new Date(),
                            endDate: new Date(),
                            patient: patient,
                            visitType: 'Pharmacy'
                        });
                        this.set('visit', visit);
                        patientVisits.addObject(visit);
                        promises.push(patient.save());
                    }
                    visit.get('medication').then(function(visitMedications) {
                        visitMedications.addObject(medication);
                        promises.push(visit.save());
                        Ember.RSVP.all(promises, 'All updates done for medication visit before medication save').then(function() {        
                            this.finishBeforeUpdate(isFulfilling,  resolve);
                        }.bind(this), reject);
                    }.bind(this));                    
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
            var fulfillmentLocations = this.get('fulfillmentLocations'),
                inventoryRequest = this.get('store').createRecord('inv-request', {
                    dateCompleted: new Date(),
                    inventoryItem: this.get('inventoryItem'),
                    quantity: this.get('quantity'),
                    transactionType: 'Fulfillment',
                    patient: this.get('patient'),
                    markAsConsumed: true
                });
            inventoryRequest.get('inventoryLocations').then(function(inventoryLocations) {
                inventoryLocations.addObjects(fulfillmentLocations);
                this.send('fulfillRequest', inventoryRequest, false, false, true);
                this.set('status','Fulfilled');
                resolve();
            }.bind(this));            
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