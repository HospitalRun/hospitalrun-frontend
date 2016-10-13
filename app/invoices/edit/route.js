import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
export default AbstractEditRoute.extend({
  editTitle: 'Edit Invoice',
  modelName: 'invoice',
  newTitle: 'New Invoice',

  actions: {
    deleteCharge: function(model) {
      this.controller.send('deleteCharge', model);
    },

    deleteLineItem: function(model) {
      this.controller.send('deleteLineItem', model);
    },

    removePayment: function(model) {
      this.controller.send('removePayment', model);
    }
  },

  afterModel: function(model) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      let lineItems = model.get('lineItems');
      let promises = [];
      lineItems.forEach(function(lineItem) {
        promises.push(lineItem.reload());
      });
      Ember.RSVP.all(promises, 'Reload billing line items for invoice').then(function(results) {
        let detailPromises = [];
        results.forEach(function(result) {
          result.get('details').forEach(function(detail) {
            detailPromises.push(detail.reload());
          });
        });
        Ember.RSVP.all(detailPromises, 'Reload billing line item details for invoice').then(resolve, reject);
      }, reject);
    });
  },

  getNewData: function() {
    return Ember.RSVP.resolve({
      billDate: new Date(),
      status: 'Draft'
    });
  },

  setupController: function(controller, model) {
    model.set('originalPaymentProfileId', model.get('paymentProfile.id'));
    this._super(controller, model);
    let lineItems = model.get('lineItems');
    let promises = [];
    lineItems.forEach(function(lineItem) {
      lineItem.get('details').forEach(function(detail) {
        let pricingItem = detail.get('pricingItem');
        if (!Ember.isEmpty(pricingItem)) {
          promises.push(pricingItem.reload());
        }
      });
    });
  }
});
