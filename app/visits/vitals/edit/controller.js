<<<<<<< HEAD
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';
import Ember from 'ember';

export default AbstractEditController.extend({
  cancelAction: 'closeModal',

  editController: Ember.inject.controller('visits/edit'),

  newVitals: false,

  temperatureLabel: 'Temperature (\xb0C)',

  title: function() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return 'Add Vitals';
    }
    return 'Edit Vitals';
  }.property('model.isNew'),

  updateCapability: 'add_vitals',

  beforeUpdate() {
    if (this.get('model.isNew')) {
      this.set('newVitals', true);
    }
    return Ember.RSVP.Promise.resolve();
  },

  afterUpdate(vitals) {
    if (this.get('newVitals')) {
      this.get('editController').send('addVitals', vitals);
    } else {
      this.send('closeModal');
    }
  }
});
=======
import { Promise as EmberPromise } from 'rsvp';
import { inject as controller } from '@ember/controller';
import AbstractEditController from 'hospitalrun/controllers/abstract-edit-controller';

export default AbstractEditController.extend({
  cancelAction: 'closeModal',

  editController: controller('visits/edit'),

  newVitals: false,

  temperatureLabel: 'Temperature (\xb0C)',

  title: function() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return 'Add Vitals';
    }
    return 'Edit Vitals';
  }.property('model.isNew'),

  updateCapability: 'add_vitals',

  beforeUpdate() {
    if (this.get('model.isNew')) {
      this.set('newVitals', true);
    }
    return EmberPromise.resolve();
  },

  afterUpdate(vitals) {
    if (this.get('newVitals')) {
      this.get('editController').send('addVitals', vitals);
    } else {
      this.send('closeModal');
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
