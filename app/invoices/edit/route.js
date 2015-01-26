import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
export default AbstractEditRoute.extend(PatientListRoute, {
    editTitle: 'Edit Invoice',
    modelName: 'invoice',
    newTitle: 'New Invoice',
    
    getNewData: function() {
        return {
            billDate: new Date(),
            selectPatient: true            
        };
    }
});