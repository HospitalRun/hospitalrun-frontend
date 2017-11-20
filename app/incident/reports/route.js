import EmberObject from '@ember/object';
import { resolve } from 'rsvp';
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
export default AbstractIndexRoute.extend({
  pageTitle: 'Incident Report',

  // No model for reports; data gets retrieved when report is run.
  model() {
    return resolve(EmberObject.create({}));
  }

});
