import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import FulfillRequest from "hospitalrun/mixins/fulfill-request";
import InventoryLocations from "hospitalrun/mixins/inventory-locations"; //inventory-locations mixin is needed for fulfill-request mixin!
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
export default AbstractEditRoute.extend(FulfillRequest, InventoryLocations, PatientListRoute, {
    editTitle: 'Edit Medication Request', 
    modelName: 'medication',
    newTitle: 'New Medication Request',
    pouchdb: Ember.inject.service(),
    getNewData: function(params) {
        var idParam = this.get('idParam'),
            newData = {
                selectPatient: true,
                prescriptionDate: moment().startOf('day').toDate()
            };
        if (params[idParam] === 'dispense') {
            newData.shouldFulfillRequest = true;
            newData.hideFulfillRequest = true;
        }
        return Ember.RSVP.resolve(newData);
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
    
    model: function(params) {
        var idParam = this.get('idParam');
        if (!Ember.isEmpty(idParam) && params[idParam] === 'new' || params[idParam] === 'dispense') {
            return this._createNewRecord(params);
        } else {
            return this._super(params);
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
            var pouchdb = this.get('pouchdb');
            pouchdb.queryMainDB(inventoryQuery, 'inventory_by_type').then(function(result) {
                var medicationList = result.rows.map(function(medication) {
                    var medicationValues = medication.doc.data;
                    medicationValues.id = pouchdb.getEmberId(medication.id);
                    return medicationValues;
                });
                controller.set('medicationList', medicationList);
            });
        }
        if (Ember.isEmpty(patient)) {
            this._fetchPatientList(controller);
        }        
    }
});