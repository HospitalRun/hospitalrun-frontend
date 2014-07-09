import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
    additionalModels: [{ 
        name: 'clinicList',
        findArgs: ['lookup','clinic_list']
    },  {
        name: 'countryList',
        findArgs: ['lookup','country_list']
    }],
    modelName: 'patient',
    moduleName: 'patients',
    newButtonText: '+ new patient',
    sectionTitle: 'Patients'    
   
});