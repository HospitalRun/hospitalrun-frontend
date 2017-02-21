import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default AbstractEditRoute.extend({
  modelName: 'report',
  customForms: Ember.inject.service(),

  getNewData() {
    let newReportData = {
      reportDate: new Date(),
      customForms: Ember.Object.create()
    };
    let customForms = this.get('customForms');
    return customForms.setDefaultCustomForms(['opdReport'], newReportData);
  },

  afterModel(model) {
    if (model.get('isNew')) {
      let visit = this.modelFor('visits.edit');
      if (!visit) {
        return this.transitionTo('patients');
      }
      model.set('visit', visit);
    }
    model.setProperties({ returnToVisit: model.get('visit.id') });
  },

  getScreenTitle(model) {
    let state = model.get('isNew') ? 'new' : 'edit';
    let type = model.get('visit.outPatient') ? 'opd' : 'discharge';
    return t(`reports.${type}.titles.${state}`);
  },

  setupController(controller, model) {
    this._super(controller, model);
  }
});
