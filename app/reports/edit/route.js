import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';

export default AbstractEditRoute.extend({
  modelName: 'report',
  customForms: Ember.inject.service(),

  getNewData() {
    let newReportData = {
      reportDate: new Date(),
      customForms: Ember.Object.create()
    };
    let customForms = this.get('customForms');
    return customForms.setDefaultCustomForms(['opdReport'], newReportData);
  },

  setupController(controller, model) {
    this._super(controller, model);
  }
});
