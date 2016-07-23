import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';

export default AbstractIndexRoute.extend({
  pageTitle: t('patients.titles.patientReport'),

  // No model for reports; data gets retrieved when report is run.
  model: function() {
    return Ember.RSVP.resolve(Ember.Object.create({}));
  }

});
