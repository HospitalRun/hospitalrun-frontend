import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default AbstractEditRoute.extend({
  customForms: Ember.inject.service(),
  editTitle: t('operationReport.titles.editTitle'),
  modelName: 'operation-report',
  newTitle: t('operationReport.titles.newTitle'),

  getNewData() {
    let customForms = this.get('customForms');
    let newData = {
      customForms: Ember.Object.create()
    };
    return customForms.setDefaultCustomForms(['operativePlan'], newData);
  }
});
