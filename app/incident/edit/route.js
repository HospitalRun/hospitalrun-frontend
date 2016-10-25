import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';
import { translationMacro as t } from 'ember-i18n';
export default AbstractEditRoute.extend(UserSession, {
  newTitle: t('incident.titles.newIncident'),
  editTitle: t('incident.titles.editIncident'),
  modelName: 'incident',

  getNewData: function() {
    return Ember.RSVP.resolve({
      reportedBy: this.getUserName(true)
    });
  }
});
