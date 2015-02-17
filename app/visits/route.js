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
        name: 'physicianList',
        findArgs: ['lookup','physician_list']
    }, {
        name: 'locationList',
        findArgs: ['lookup','visit_location_list']
    }, {
        name: 'procedureLocations',
        findArgs: ['lookup','procedure_locations']
    }, {
        name: 'procedurePricingTypes',
        findArgs: ['lookup','procedure_pricing_types']
    }, {
        name: 'wardPricingTypes',
        findArgs: ['lookup','ward_pricing_types']
    }],
    moduleName: 'visits',
    newButtonText: '+ new visit',
    sectionTitle: 'Visits'
   
});