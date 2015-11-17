import IncidentIndexRoute from 'hospitalrun/incident/index/route';
import UserSession from "hospitalrun/mixins/user-session";
export default IncidentIndexRoute.extend(UserSession, {
    editReturn: 'incident.completed',
    modelName: 'incident',
    pageTitle: 'Closed Incidents',

    _getStartKeyFromItem: function(item) {        
        return [item.get('reportedBy'),'incident_'+item.get('id')];
    },
    
    _modelQueryParams: function() {
        var maxValue = this.get('maxValue'),
            currentUser = this.getUserName(true),
            queryParams = {
                mapReduce: 'closed_incidents_by_user'
            };
        if (!this.currentUserCan('edit_others_incident')) {
                queryParams.options = 
                    {
                        startkey:  [currentUser,null],
                        endkey: [currentUser,'incident_'+maxValue]
                    };             
        }
        return queryParams;
    }

});