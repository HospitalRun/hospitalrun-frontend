import { resolve } from 'rsvp';
import { isEmpty } from '@ember/utils';
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
export default AbstractEditRoute.extend({
  editTitle: 'Edit Pricing Item',
  modelName: 'pricing',
  newTitle: 'New Pricing Item',

  actions: {
    deleteOverride(overrideToDelete) {
      this.controller.send('deleteOverride', overrideToDelete);
    }
  },

  getNewData(params) {
    let newCategory = params.pricing_id.substr(3);
    let newPricingType = null;

    if (isEmpty(newCategory)) {
      newCategory = 'Imaging';
    }

    if (newCategory === 'Lab') {
      newPricingType = 'Lab Procedure';
    } else if (newCategory === 'Imaging') {
      newPricingType = 'Imaging Procedure';
    }

    return resolve({
      category: newCategory,
      pricingType: newPricingType
    });
  },

  model(params) {
    let idParam = this.get('idParam');
    if (!isEmpty(idParam) && params[idParam].indexOf('new') === 0) {
      return this._createNewRecord(params);
    } else {
      return this._super(params);
    }
  }

});
