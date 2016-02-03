import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractIndexRoute.extend(UserSession, {
  editReturn: 'incident.index',
  modelName: 'incident',
  pageTitle: 'Incidents',

  _getStartKeyFromItem: function(item) {
    var id = this._getPouchIdFromItem(item);
    return [item.get('reportedBy'), id];
  },

  _modelQueryParams: function() {
    var maxId = this._getMaxPouchId(),
        currentUser = this.getUserName(true),
        queryParams = {
          mapReduce: 'open_incidents_by_user'
        };
    if (!this.currentUserCan('edit_others_incident')) {
      queryParams.options = {
        startkey:  [currentUser, null],
        endkey: [currentUser, maxId]
      };
    }
    return queryParams;
  }

});
