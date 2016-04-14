import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import ChargeRoute from 'hospitalrun/mixins/charge-route';
import Ember from 'ember';
export default AbstractEditRoute.extend(ChargeRoute, {
  editTitle: 'Edit Visit',
  modelName: 'visit',
  newTitle: 'New Visit',
  pricingCategory: 'Ward',

  getNewData: function() {
    return Ember.RSVP.resolve({
      visitType: 'Admission',
      startDate: new Date(),
      status: 'Admitted'
    });
  },

  actions: {
    updateNote: function() {
      this.controller.send('update', true);
    },
    deletePatientNote: function(model) {
      this.controller.send('deletePatientNote', model);
    }
  }
});