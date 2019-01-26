import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import UserSession from 'hospitalrun/mixins/user-session';
import { t } from 'hospitalrun/macro';
export default AbstractIndexRoute.extend(UserSession, {
  editReturn: 'incident.index',
  itemsPerPage: null, // Fetch all incidents as one page
  modelName: 'incident',
  pageTitle: t('incident.titles.incidents'),

  _getStartKeyFromItem(item) {
    let id = this._getPouchIdFromItem(item);
    return [item.get('reportedBy'), id];
  },

  _modelQueryParams() {
    let maxId = this._getMaxPouchId();
    let currentUser = this.getUserName(true);
    let queryParams = {
      mapReduce: 'open_incidents_by_user'
    };
    if (!this.currentUserCan('manage_incidents')) {
      queryParams.options = {
        startkey: [currentUser, null],
        endkey: [currentUser, maxId]
      };
    }
    return queryParams;
  }

});
