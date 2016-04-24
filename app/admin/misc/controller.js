import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Controller.extend(EmberValidations, {
  hideCancelButton: true,
  updateCapability: 'update_config',

  /*  afterUpdate: function() {
      this.displayAlert(this.get('i18n').t('admin.address.titles.options_saved'), this.get('i18n').t('admin.address.messages.address_saved'));
    },*/

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
    addExpansion: function() {
      const newExpansion = this.get('newExpansion');
      const self = this;
      newExpansion.save().then(() => {
        self.createExpansion();
      });
    }
  }
});
