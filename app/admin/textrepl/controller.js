import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations, {
  hideCancelButton: true,
  updateCapability: 'update_config',

  createExpansion: function() {
    const newExpansion = this.get('store').createRecord('text-expansion');
    this.set('newExpansion', newExpansion);
  }.on('init'),

  validations: {
    'newExpansion.from': {
      presence: true
    },
    'newExpansion.to': {
      presence: true
    }
  },

  actions: {
    cancelExpansion: function() {
      this.createExpansion();
    }
  }
});
