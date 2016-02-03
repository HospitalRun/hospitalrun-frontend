import IncidentIndexRoute from 'hospitalrun/incident/index/route';
import UserSession from 'hospitalrun/mixins/user-session';
export default IncidentIndexRoute.extend(UserSession, {
  editReturn: 'incident.listing',
  modelName: 'inc-reviewer',
  pageTitle: 'Incidents as Reviewer',

  _modelQueryParams: function() {
    var maxId = this._getMaxPouchId(),
        currentUser = this.getUserName(true),
        queryParams = {
          mapReduce: 'incident_by_reviewers'
        };
    queryParams.options = {
      startkey:  [currentUser,null],
      endkey: [currentUser, maxId]
    };
    return queryParams;
  }

});
