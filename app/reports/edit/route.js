import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';

export default AbstractEditRoute.extend({
  modelName: 'report',
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
