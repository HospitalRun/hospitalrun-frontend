import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import FulfillRequest from "hospitalrun/mixins/fulfill-request";
import InventoryLocations from "hospitalrun/mixins/inventory-locations"; //inventory-locations mixin is needed for fulfill-request mixin!
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
export default AbstractEditRoute.extend(FulfillRequest, InventoryLocations, PatientListRoute, {
    editTitle: 'Edit Medication Request', 
    modelName: 'medication',
    newTitle: 'New Medication Request',
    getNewData: function() {
        return Ember.RSVP.resolve({
            selectPatient: true,
            prescriptionDate: moment().startOf('day').toDate()
        });
    },
    
    afterModel: function(model) {
        var inventoryItem = model.get('inventoryItem');
        if (!Ember.isEmpty(inventoryItem)) {
            //Make sure inventory item is fully resolved.
            return new Ember.RSVP.Promise(function(resolve, reject) {
                inventoryItem.reload().then(function(inventoryItem) {
                    model.set('inventoryItem', inventoryItem);
                    resolve();
                }, reject);                
            }.bind(this));
        }
    },
    
    setupController: function(controller, model) {
        this._super(controller, model);
        var inventoryQuery = {
            key:  'Medication',            
            include_docs: true,
        };
        var inventoryItem = model.get('inventoryItem'),
            patient = model.get('patient');
        if (Ember.isEmpty(inventoryItem)) {
            this.controllerFor('pouchdb').queryMainDB(inventoryQuery, 'inventory_by_type').then(function(result) {
                var medicationList = result.rows.map(function(medication) {
                    return medication.doc;
                });
                controller.set('medicationList', medicationList);
            });
        }
        if (Ember.isEmpty(patient)) {
            this._fetchPatientList(controller);
        }        
    }
});