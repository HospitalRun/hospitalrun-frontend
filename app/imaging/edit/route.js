import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
export default AbstractEditRoute.extend(ChargeRoute, PatientListRoute, {
    editTitle: 'Edit Imaging Request',
    modelName: 'imaging',
    newTitle: 'New Imaging Request',
    
    getNewData: function() {
        return {
            selectPatient: true,
            requestDate: moment().startOf('day').toDate()
        };
    }
});