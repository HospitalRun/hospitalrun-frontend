import IncidentIndexRoute from 'hospitalrun/incident/index/route';
import UserSession from 'hospitalrun/mixins/user-session';
import { translationMacro as t } from 'ember-i18n';
export default IncidentIndexRoute.extend(UserSession, {
  editReturn: 'incident.listing',
  modelName: 'inc-reviewer',
  pageTitle: t('incident.titles.as_reviewer'),

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
