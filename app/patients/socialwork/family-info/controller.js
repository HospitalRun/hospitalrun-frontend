import Ember from 'ember';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
export default Ember.Controller.extend(IsUpdateDisabled, {
  patientsController: Ember.inject.controller('patients'),

  editController: Ember.computed.alias('patientsController'),
  showUpdateButton: true,
  title: t('patients.titles.family_info'),
  updateButtonAction: 'update',

  updateButtonText: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('i18n').t('buttons.add');
    } else {
      return this.get('i18n').t('buttons.add');
    }
  }.property('model.isNew'),

  actions: {
    cancel: function() {
      this.send('closeModal');
    },

    update: function() {
      var model = this.get('model');
      this.get('editController').send('updateFamilyInfo', model);
    }
  }
});
