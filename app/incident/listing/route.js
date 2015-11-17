import IncidentIndexRoute from 'hospitalrun/incident/index/route';
import UserSession from "hospitalrun/mixins/user-session";
export default IncidentIndexRoute.extend(UserSession, {
    editReturn: 'incident.listing',
    modelName: 'incident',
    pageTitle: 'Incidents as Reviewer',
    
    _modelQueryParams: function() {
        var maxValue = this.get('maxValue'),
            currentUser = this.getUserName(true),
            queryParams = {
                mapReduce: 'incident_by_reviewers'
            };

        queryParams.options = 
                    {
                        startkey:  [currentUser,null],
                        endkey: [currentUser,'inc-reviewer_'+maxValue]
                    };       
        return queryParams;
    }

});