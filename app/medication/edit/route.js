import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import FulfillRequest from "hospitalrun/mixins/fulfill-request";
import InventoryLocations from "hospitalrun/mixins/inventory-locations"; //inventory-locations mixin is needed for fulfill-request mixin!
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
export default AbstractEditRoute.extend(FulfillRequest, InventoryLocations, PatientListRoute, {
    editTitle: 'Edit Medication Request', 
    modelName: 'medication',
    newTitle: 'New Medication Request',
    getNewData: function() {
        return {
            selectPatient: true,
            prescriptionDate: moment().startOf('day').toDate()
        };
    },
    
    setupController: function(controller, model) {
        this._super(controller, model);
        var inventoryQuery = {
            startkey:  ['Medication','inventory_'],
            endkey: ['Medication','inventory_\uffff'],
            include_docs: true,
        };
        this.controllerFor('pouchdb').queryMainDB(inventoryQuery, 'inventory_by_type').then(function(result) {
            var medicationList = result.rows.map(function(medication) {
                return medication.doc;
            });
            controller.set('medicationList', medicationList);
        });
        this._fetchPatientList(controller);
    }
});