import AbstractSearchRoute from 'hospitalrun/routes/abstract-search-route';
import IncidentSearch from 'hospitalrun/utils/incident-search';
export default AbstractSearchRoute.extend({
    moduleName: 'incident',
    searchKeys: [        
        'friendlyId',
        'reportedBy',
        'locationOfIncident',
        'categoryName'
    ],
    searchIndex: IncidentSearch,
    searchModel: 'incident'
});
