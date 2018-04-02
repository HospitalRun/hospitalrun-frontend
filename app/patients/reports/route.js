import { resolve } from 'rsvp';
import EmberObject, { computed } from '@ember/object';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { translationMacro as t } from 'ember-i18n';

export default AbstractIndexRoute.extend({
  pageTitle: computed('i18n.locale', () => {
    return t('patients.titles.patientReport');
  }),

  // No model for reports; data gets retrieved when report is run.
  model() {
    return resolve(EmberObject.create({}));
  }

});
