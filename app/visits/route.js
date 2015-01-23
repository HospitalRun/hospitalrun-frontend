import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
export default AbstractModuleRoute.extend({
    addCapability: 'add_visit',
    additionalModels: [{
        name: 'anesthesiaTypes',
        findArgs: ['lookup','anesthesia_types'],
    }, {
        name: 'anesthesiologistList',
        findArgs: ['lookup','anesthesiologists'],
    }, {
        name: 'clinicList',
        findArgs: ['lookup','clinic_list']
    }, { 
        name: 'equipmentList',
        findArgs: ['lookup','equipment_list']
    }, { 
        name: 'physicianList',
        findArgs: ['lookup','physician_list']
    }, {
        name: 'locationList',
        findArgs: ['lookup','visit_location_list']
    }, {
        name: 'procedureLocations',
        findArgs: ['lookup','procedure_locations']
    }],
    moduleName: 'visits',
    newButtonText: '+ new visit',
    sectionTitle: 'Visits'
   
});