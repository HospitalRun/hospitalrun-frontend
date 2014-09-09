import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import PatientId from 'hospitalrun/mixins/patient-id';
export default AbstractEditRoute.extend(PatientId, {
    editTitle: 'Edit Patient',
    modelName: 'patient',
    newTitle: 'New Patient'
});