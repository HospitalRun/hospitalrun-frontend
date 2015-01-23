import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(PatientSubmodule, {
    needs: ['visits','visits/edit','pouchdb'],
        
    cancelAction: 'returnToVisit',
    canAddProcedure: function() {        
        return this.currentUserCan('add_procedure');
    }.property(),
    
    canAddCharge: function() {        
        return this.currentUserCan('add_procedure');
    }.property(),
    
    anesthesiaTypes: Ember.computed.alias('controllers.visits.anesthesiaTypes'),
    anesthesiologistList: Ember.computed.alias('controllers.visits.anesthesiologistList'),
    physicianList: Ember.computed.alias('controllers.visits.physicianList'),
    procedureLocations: Ember.computed.alias('controllers.visits.procedureLocations'),
    lookupListsToUpdate: [{
        name: 'anesthesiaTypes',
        property: 'anesthesiaType',
        id: 'anesthesia_types'
    }, {
        name: 'anesthesiologistList',
        property: 'anesthesiologist',
        id: 'anesthesiologists'
    }, {
        name: 'physicianList',
        property: 'assistant',
        id: 'physician_list'
    }, {
        name: 'physicianList',
        property: 'physician',
        id: 'physician_list'
    }, {
        name: 'procedureLocations',
        property: 'location',
        id: 'procedure_locations'
    }],
    
    editController: Ember.computed.alias('controllers.visits/edit'),
    visitProcedures: Ember.computed.alias('visit.procedures'),
    
    pricingList: null, //This gets filled in by the route
    newProcedure: false,
    
    title: function() {
        var isNew = this.get('isNew');
        if (isNew) {
            return 'Add Procedure';
        }
        return 'Edit Procedure';
	}.property('isNew'),
    
    billingIdChanged: function() {
        this.get('model').validate();
    }.observes('billingId'),
    
    updateCapability: 'add_procedure',
    
    actions: {
        addCharge: function(charge) {
            var charges = this.get('charges');
            charges.addObject(charge);
            this.send('update', true);
            this.send('closeModal');
        },
        
        deleteCharge: function(model) {
            var chargeToDelete = model.get('chargeToDelete'),
                charges = this.get('charges');
            charges.removeObject(chargeToDelete);
            chargeToDelete.destroyRecord();
            this.send('update', true);
            this.send('closeModal');
        },
        
        showAddCharge: function() {
            var newCharge = this.get('store').createRecord('proc-charge',{
                quantity: 1
            });
            this.send('openModal', 'procedures.charge', newCharge);
        },
        
        showEditCharge: function(charge) {
            this.send('openModal', 'procedures.charge', charge);            
        },
        
        showDeleteCharge: function(charge) {
            this.send('openModal', 'dialog', Ember.Object.create({
                confirmAction: 'deleteCharge',
                title: 'Delete Charge Item',
                message: 'Are you sure you want to delete this charged item?',
                chargeToDelete: charge,
                updateButtonAction: 'confirm',
                updateButtonText: 'Ok'
            }));                 
        }
    },
    
    beforeUpdate: function() {
        if (this.get('isNew')) {
            this.set('newProcedure', true);         
        }
        return Ember.RSVP.Promise.resolve();
    },
    
    afterUpdate: function(procedure) {
        var alertTitle = 'Procedure Saved',
            alertMessage = 'The procedure record has been saved.';
        if (this.get('newProcedure')) {
            this.get('visitProcedures').then(function(list) {
                list.addObject(procedure);
                this.get('editController').send('update');
                this.displayAlert(alertTitle, alertMessage);                
            }.bind(this));            
        } else {
            this.displayAlert(alertTitle, alertMessage);
        }
    }
});