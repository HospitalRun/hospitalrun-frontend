import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
import Ember from 'ember';

export default AbstractEditRoute.extend(ChargeRoute, {
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
