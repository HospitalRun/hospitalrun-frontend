import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default AbstractEditRoute.extend({
  customForms: Ember.inject.service(),
  editTitle: t('operativePlan.titles.editTitle'),
  modelName: 'operative-plan',
  newTitle: t('operativePlan.titles.newTitle'),

  getNewData() {
    let customForms = this.get('customForms');
    let newData = {
      customForms: Ember.Object.create()
    };
    return customForms.setDefaultCustomForms(['operativePlan'], newData);
  },

  actions: {
    showOperationReport(report) {
      this.transitionTo('patients.operation-report', report);
    }
  }
});
