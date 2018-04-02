import { isEmpty } from '@ember/utils';
import {
  Promise as EmberPromise,
  all,
  resolve
} from 'rsvp';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
export default AbstractEditRoute.extend({
  editTitle: 'Edit Invoice',
  modelName: 'invoice',
  newTitle: 'New Invoice',

  actions: {
    deleteCharge(model) {
      this.controller.send('deleteCharge', model);
    },

    deleteLineItem(model) {
      this.controller.send('deleteLineItem', model);
    },

    removePayment(model) {
      this.controller.send('removePayment', model);
    }
  },

  afterModel(model) {
    return new EmberPromise(function(resolve, reject) {
      let lineItems = model.get('lineItems');
      let promises = [];
      lineItems.forEach(function(lineItem) {
        promises.push(lineItem.reload());
      });
      all(promises, 'Reload billing line items for invoice').then(function(results) {
        let detailPromises = [];
        results.forEach(function(result) {
          result.get('details').forEach(function(detail) {
            detailPromises.push(detail.reload());
          });
        });
        all(detailPromises, 'Reload billing line item details for invoice').then(resolve, reject);
      }, reject);
    });
  },

  getNewData() {
    return resolve({
      billDate: new Date(),
      status: 'Draft'
    });
  },

  setupController(controller, model) {
    model.set('originalPaymentProfileId', model.get('paymentProfile.id'));
    this._super(controller, model);
    let lineItems = model.get('lineItems');
    let promises = [];
    lineItems.forEach(function(lineItem) {
      lineItem.get('details').forEach(function(detail) {
        let pricingItem = detail.get('pricingItem');
        if (!isEmpty(pricingItem)) {
          promises.push(pricingItem.reload());
        }
      });
    });
  }
});
