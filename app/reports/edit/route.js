import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default AbstractEditRoute.extend(ChargeRoute, {
  editTitle: t('reports.titles.edit'),
  modelName: 'report',
  newTitle: t('reports.titles.new'),
  database: Ember.inject.service(),

  getNewData() {
    return Ember.RSVP.resolve({
      reportDate: new Date()
    });
  },

  setupController(controller, model) {
    this._super(controller, model);
  }
});
