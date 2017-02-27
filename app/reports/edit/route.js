import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import AddToPatientRoute from 'hospitalrun/mixins/add-to-patient-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default AbstractEditRoute.extend(AddToPatientRoute, {
  modelName: 'report',
  customForms: Ember.inject.service(),

  getNewData() {
    let newReportData = {
      reportDate: new Date(),
      customForms: Ember.Object.create()
    };
    let customForms = this.get('customForms');
    return customForms.setDefaultCustomForms(['opdReport', 'dischargeReport'], newReportData);
  },

  getScreenTitle(model) {
    let state = model.get('isNew') ? 'new' : 'edit';
    let type = model.get('visit.outPatient') ? 'opd' : 'discharge';
    return t(`reports.${type}.titles.${state}`);
  },

  afterModel(model) {
    if (!model.get('visit')) {
      return this.transitionTo('patients');
    }
  },

  setupController(controller, model) {
    this._super(controller, model);
  }
});
