import IncidentIndexRoute from 'hospitalrun/incident/index/route';
import UserSession from 'hospitalrun/mixins/user-session';
import { translationMacro as t } from 'ember-i18n';
export default IncidentIndexRoute.extend(UserSession, {
  editReturn: 'incident.completed',
  modelName: 'incident',
  pageTitle: t('incident.titles.closed'),

  _getStartKeyFromItem(item) {
    let id = this._getPouchIdFromItem(item);
    return [item.get('reportedBy'), id];
  },

  _modelQueryParams() {
    let maxId = this._getMaxPouchId();
    let currentUser = this.getUserName(true);
    let queryParams = {
      mapReduce: 'closed_incidents_by_user'
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
