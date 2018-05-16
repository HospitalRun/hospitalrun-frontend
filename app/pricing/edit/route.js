<<<<<<< HEAD
import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
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
    if (Ember.isEmpty(newCategory)) {
      newCategory = 'Imaging';
    }
    return Ember.RSVP.resolve({
      category: newCategory
    });
  },

  model(params) {
    let idParam = this.get('idParam');
    if (!Ember.isEmpty(idParam) && params[idParam].indexOf('new') === 0) {
      return this._createNewRecord(params);
    } else {
      return this._super(params);
    }
  }

});
=======
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
    if (isEmpty(newCategory)) {
      newCategory = 'Imaging';
    }
    return resolve({
      category: newCategory
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
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
