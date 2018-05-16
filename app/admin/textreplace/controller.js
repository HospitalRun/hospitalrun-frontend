<<<<<<< HEAD
import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations, {
  hideCancelButton: true,
  updateCapability: 'update_config',

  createExpansion: function() {
    let newExpansion = this.get('store').createRecord('text-expansion');
    this.set('newExpansion', newExpansion);
  }.on('init'),

  actions: {
    cancelExpansion() {
      this.createExpansion();
    }
  },

  validations: {
    'newExpansion.from': {
      presence: true
    },
    'newExpansion.to': {
      presence: true
    }
  }
});
=======
import Controller from '@ember/controller';
import EmberValidations from 'ember-validations';

export default Controller.extend(EmberValidations, {
  hideCancelButton: true,
  updateCapability: 'update_config',

  createExpansion: function() {
    let newExpansion = this.get('store').createRecord('text-expansion');
    this.set('newExpansion', newExpansion);
  }.on('init'),

  actions: {
    cancelExpansion() {
      this.createExpansion();
    }
  },

  validations: {
    'newExpansion.from': {
      presence: true
    },
    'newExpansion.to': {
      presence: true
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
