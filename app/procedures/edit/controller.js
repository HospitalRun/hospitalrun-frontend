import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import ChargeActions from 'hospitalrun/mixins/charge-actions';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(ChargeActions, PatientSubmodule, {
    needs: ['visits','visits/edit','pouchdb'],
        
    cancelAction: 'returnToVisit',
    canAddProcedure: function() {        
        return this.currentUserCan('add_procedure');
    }.property(),
    
    canAddCharge: function() {        
        return this.currentUserCan('add_charge');
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