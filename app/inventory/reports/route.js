import EmberObject from '@ember/object';
import { resolve } from 'rsvp';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import { t } from 'hospitalrun/macro';
export default AbstractIndexRoute.extend({
  pageTitle: t('inventory.titles.inventoryReport'),

  // No model for reports; data gets retrieved when report is run.
  model() {
    return resolve(EmberObject.create({}));
  }

});
