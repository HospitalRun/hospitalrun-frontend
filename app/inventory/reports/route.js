import EmberObject from '@ember/object';
import { resolve } from 'rsvp';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { translationMacro as t } from 'ember-intl';
export default AbstractIndexRoute.extend({
  pageTitle: t('inventory.titles.inventoryReport'),

  // No model for reports; data gets retrieved when report is run.
  model() {
    return resolve(EmberObject.create({}));
  }

});
