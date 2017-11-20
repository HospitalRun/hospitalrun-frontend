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
