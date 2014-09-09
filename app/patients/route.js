import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import PatientId from 'hospitalrun/mixins/patient-id';
export default AbstractModuleRoute.extend(PatientId, {
    addCapability: 'add_patient',
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