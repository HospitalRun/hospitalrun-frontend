import { resolve } from 'rsvp';
import EmberObject, { computed } from '@ember/object';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { translationMacro as t } from 'ember-intl';

export default AbstractIndexRoute.extend({
  pageTitle: computed('intl.locale', () => {
    return t('patients.titles.patientReport');
  }),

  // No model for reports; data gets retrieved when report is run.
  model() {
    return resolve(EmberObject.create({}));
  }

});
