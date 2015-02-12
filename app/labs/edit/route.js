import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
export default AbstractEditRoute.extend(ChargeRoute, PatientListRoute, {
    editTitle: 'Edit Lab Request',
    modelName: 'lab',
    newTitle: 'New Lab Request',
    pricingCategory: 'Lab',
    
    getNewData: function() {
        return {
            selectPatient: true,
            requestDate: moment().startOf('day').toDate()
        };
    }
});