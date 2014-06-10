import AbstractItemRoute from 'hospitalrun/routes/abstract-item-route';
export default AbstractItemRoute.extend({
    currentScreenTitle: 'Patient Listing',
    editTitle: 'Edit Patient',    
    newTitle: 'New Patient',
    modelName: 'patient',
    moduleName: 'patients',
    newButtonText: '+ new patient',
    sectionTitle: 'Patients'
});