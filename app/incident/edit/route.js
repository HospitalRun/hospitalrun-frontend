import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
import UserSession from 'hospitalrun/mixins/user-session';
import { translationMacro as t } from 'ember-i18n';

export default AbstractEditRoute.extend(PatientListRoute, UserSession, {
  editTitle: t('incident.titles.editIncident'),
  modelName: 'incident',
  newTitle: t('incident.titles.newIncident'),

  getNewData() {
    let now = new Date();
    return Ember.RSVP.resolve({
      dateOfIncident: now,
      reportedDate: now,
      reportedBy: this.getUserName(true),
      reportedByDisplayName: this.getUserName(false)
    });
  }
});
