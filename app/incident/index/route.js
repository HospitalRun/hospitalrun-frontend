import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import UserSession from "hospitalrun/mixins/user-session";
export default AbstractIndexRoute.extend(UserSession, {
    editReturn: 'incident.index',
    modelName: 'incident',
    pageTitle: 'Incidents',
    
    _getStartKeyFromItem: function(item) {        
        return [item.get('reportedBy'),'incident_'+item.get('id')];
    },
    
    _modelQueryParams: function() {
        var maxValue = this.get('maxValue'),
            currentUser = this.getUserName(true),
            queryParams = {
                mapReduce: 'open_incidents_by_user'
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