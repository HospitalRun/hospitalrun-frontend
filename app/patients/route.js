import AbstractItemRoute from 'hospitalrun/routes/abstract-item-route';
export default AbstractItemRoute.extend({
    additionalModels: [{ 
        name: 'clinicList',
        findArgs: ['lookup','clinic_list']
    },  {
        name: 'countryList',
        findArgs: ['lookup','country_list']
    }],
        
    currentScreenTitle: 'Patient Listing',
    editTitle: 'Edit Patient',    
    newTitle: 'New Patient',
    modelName: 'patient',
    moduleName: 'patients',
    newButtonText: '+ new patient',
    sectionTitle: 'Patients'    
   
});