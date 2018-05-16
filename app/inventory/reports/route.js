<<<<<<< HEAD
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';
import { translationMacro as t } from 'ember-i18n';
export default AbstractIndexRoute.extend({
  pageTitle: t('inventory.titles.inventoryReport'),

  // No model for reports; data gets retrieved when report is run.
  model() {
    return Ember.RSVP.resolve(Ember.Object.create({}));
  }

});
=======
import EmberObject from '@ember/object';
import { resolve } from 'rsvp';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { translationMacro as t } from 'ember-i18n';
export default AbstractIndexRoute.extend({
  pageTitle: t('inventory.titles.inventoryReport'),

  // No model for reports; data gets retrieved when report is run.
  model() {
    return resolve(EmberObject.create({}));
  }

});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
