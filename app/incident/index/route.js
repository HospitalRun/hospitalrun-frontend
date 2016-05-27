import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import UserSession from 'hospitalrun/mixins/user-session';
import { translationMacro as t } from 'ember-i18n';
export default AbstractIndexRoute.extend(UserSession, {
  editReturn: 'incident.index',
  modelName: 'incident',
  pageTitle: t('incident.titles.incidents'),

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
