<<<<<<< HEAD
import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';
export default AbstractIndexRoute.extend({
  pageTitle: 'Incident Report',

  // No model for reports; data gets retrieved when report is run.
  model() {
    return Ember.RSVP.resolve(Ember.Object.create({}));
  }

});
=======
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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
