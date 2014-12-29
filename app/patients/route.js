import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import PatientId from 'hospitalrun/mixins/patient-id';
export default AbstractModuleRoute.extend(PatientId, {
    addCapability: 'add_patient',
    additionalModels: [{ 
        name: 'addressOptions',
        findArgs: ['option','address_options']
    }, { 
        name: 'clinicList',
        findArgs: ['lookup','clinic_list']
    },  {
        name: 'countryList',
        findArgs: ['lookup','country_list']
    },  {
        name: 'locationList',
        findArgs: ['lookup','visit_location_list']
    },{
        name: 'physicianList',
        findArgs: ['lookup','physician_list']
    }],
    moduleName: 'patients',
    newButtonText: '+ new patient',
    sectionTitle: 'Patients',
    subActions: [{
        text: 'Patient listing',
        linkTo: 'patients.index'
    }]
});