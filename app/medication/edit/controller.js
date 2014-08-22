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

    medicationList: Ember.computed.alias('controllers.medication.medicationList'),
    patientList: Ember.computed.alias('controllers.medication.patientList'),
    visitMedication: Ember.computed.alias('visit.medication'),

    afterUpdate: function(medication) {
        if (this.get('newMedication')) {
            var visit = this.get('visit'),
                visitMedications = this.get('visitMedication');
            visitMedications.addObject(medication);
            visit.save().then(function(){
                this.send(this.get('cancelAction'));            
            }.bind(this));
        } else {
            this.send(this.get('cancelAction'));
        }
    },
    
    beforeUpdate: function() {
        var isFulfilling = this.get('isFulfilling'),
            isNew = this.get('isNew');
        if (isNew) {
            this.set('newMedication', true);
            this.set('status', 'Requested');
        }
        if (isFulfilling) {
            return new Ember.RSVP.Promise(function(resolve){
                var fulfillmentLocations = this.get('fulfillmentLocations'),
                    inventoryRequest = this.get('store').createRecord('inv-request', {
                        dateCompleted: new Date(),
                        inventoryItem: this.get('inventoryItem'),
                        quantity: this.get('quantity'),
                        transactionType: 'Fulfillment',
                        patient: this.get('patient')                
                    });
                inventoryRequest.get('inventoryLocations').then(function(inventoryLocations) {
                    inventoryLocations.addObjects(fulfillmentLocations);
                });
                this.send('fulfillRequest', inventoryRequest, false, false, true);
                resolve();
            }.bind(this));
        } else {
            return Ember.RSVP.resolve();                                           
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