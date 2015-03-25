import AbstractModuleRoute from 'hospitalrun/routes/abstract-module-route';
import IncidentId from 'hospitalrun/mixins/incident-id';
export default AbstractModuleRoute.extend(IncidentId, {
    addCapability: 'add_incident',
    /*additionalModels: [{
        name: 'incidentCategoryNameList',
        findArgs: ['lookup','incidentCategoryName_list']
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
 
