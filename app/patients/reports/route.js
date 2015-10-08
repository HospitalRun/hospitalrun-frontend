import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';
export default AbstractIndexRoute.extend({
  pageTitle: 'Patient Report',

  // No model for reports; data gets retrieved when report is run.
  model: function () {
    return Ember.RSVP.resolve();
  }

});
