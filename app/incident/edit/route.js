import { inject as service } from '@ember/service';
import EmberObject, { get } from '@ember/object';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import PatientListRoute from 'hospitalrun/mixins/patient-list-route';
import UserSession from 'hospitalrun/mixins/user-session';
import { translationMacro as t } from 'ember-i18n';

export default AbstractEditRoute.extend(PatientListRoute, UserSession, {
  editTitle: t('incident.titles.editIncident'),
  modelName: 'incident',
  newTitle: t('incident.titles.newIncident'),

  customForms: service(),

  getNewData() {
    let customForms = get(this, 'customForms');
    let now = new Date();
    let newData = {
      customForms: EmberObject.create(),
      dateOfIncident: now,
      reportedDate: now,
      reportedBy: this.getUserName(true),
      reportedByDisplayName: this.getUserName(false)
    };
    return customForms.setDefaultCustomForms(['incident'], newData);
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.setupCustomForms();
  },

  actions: {
    deleteAttachment(model) {
      this.controller.send('deleteAttachment', model);
    }
  }
});
