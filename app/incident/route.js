import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import IncidentId from 'hospitalrun/mixins/incident-id';
export default AbstractModuleRoute.extend(IncidentId, {
    addCapability: 'add_incident',
    /*additionalModels: [{ 
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
    }],*/
    moduleName: 'incident',
    newButtonText: '+ new incident',
    sectionTitle: 'Incidents',
    subActions: [{
        text: 'Current',
        linkTo: 'incident.index'
    },{
        text: 'History',
        linkTo: 'incident.completed'
    }, {
        text: 'Reports',
        linkTo: 'incident.reports'
    }]
});
 
