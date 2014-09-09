import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import FulfillRequest from "hospitalrun/mixins/fulfill-request";
import InventoryLocations from "hospitalrun/mixins/inventory-locations"; //inventory-locations mixin is needed for fulfill-request mixin!
export default AbstractEditRoute.extend(FulfillRequest, InventoryLocations, {
    editTitle: 'Edit Medication Request', 
    modelName: 'medication',
    newTitle: 'New Medication Request',
    getNewData: function() {
        return {
            selectPatient: true,
            prescriptionDate: moment().startOf('day').toDate()
        };
    }
});