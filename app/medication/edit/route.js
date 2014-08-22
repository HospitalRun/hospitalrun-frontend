import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import FulfillRequest from "hospitalrun/mixins/fulfill-request";
export default AbstractEditRoute.extend(FulfillRequest, {
    editTitle: 'Edit Medication Request',    
    newTitle: 'New Medication Request'
});