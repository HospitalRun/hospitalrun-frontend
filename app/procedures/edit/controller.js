import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';
import PatientSubmodule from 'hospitalrun/mixins/patient-submodule';

export default AbstractEditController.extend(PatientSubmodule, {
    needs: ['visits','visits/edit','pouchdb'],
        
    cancelAction: 'returnToVisit',
    canAddProcedure: function() {        
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
    
    inventoryList: null, //This gets filled in by the route
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
        addConsumable: function(consumable) {
            var itemsConsumed = this.get('itemsConsumed');
            itemsConsumed.addObject(consumable);
            this.send('update', true);
            this.send('closeModal');
        },
        
        addEquipment: function(equipment) {
            var equipmentUsed = this.get('equipmentUsed');
            if (Ember.isEmpty(equipmentUsed)) {
                equipmentUsed = [];
                this.set('equipmentUsed', equipmentUsed);
            }
            equipmentUsed.addObject(equipment);
            this.send('update', true);
            this.send('closeModal');            
        },
        
        deleteConsumable: function(model) {
            var consumableToDelete = model.get('consumableToDelete'),
                itemsConsumed = this.get('itemsConsumed');
            itemsConsumed.removeObject(consumableToDelete);
            consumableToDelete.destroyRecord();
            this.send('update', true);
            this.send('closeModal');
        },
        
        deleteEquipment: function(model) {
            var equipmentToDelete = model.get('equipmentToDelete'),
                equipmentUsed = this.get('equipmentUsed');
            equipmentUsed.removeObject(equipmentToDelete);           
            this.send('update', true);
            this.send('closeModal');
        },
        
        showAddEquipment: function() {
            this.send('openModal', 'procedures.equipment',{});            
        },
        
        showAddConsumable: function() {
            var newConsumable = this.get('store').createRecord('consumable');     
            this.send('openModal', 'procedures.consumable', newConsumable);            
        },
        
        showEditConsumable: function(consumable) {  
            this.send('openModal', 'procedures.consumable', consumable);            
        },
        
        showDeleteConsumable: function(consumable) {
            this.send('openModal', 'dialog', Ember.Object.create({
                confirmAction: 'deleteConsumable',
                title: 'Delete Item',
                message: 'Are you sure you want to delete this consumed item?',
                consumableToDelete: consumable,
                updateButtonAction: 'confirm',
                updateButtonText: 'Ok'
            }));                 
        },
        
        showDeleteEquipment: function(equipment) {
            this.send('openModal', 'dialog', Ember.Object.create({
                confirmAction: 'deleteEquipment',
                title: 'Remove Equipment',
                message: 'Are you sure you want to remove this used equipment?',
                equipmentToDelete: equipment,
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
        if (this.get('newProcedure')) {
            this.get('visitProcedures').then(function(list) {
                list.addObject(procedure);
                this.get('editController').send('update');
                this.send('returnToVisit');
            }.bind(this));            
        } else {
            this.send('returnToVisit');
        }
    }
});
