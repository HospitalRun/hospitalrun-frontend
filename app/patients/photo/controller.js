import Ember from 'ember';
export default Ember.Controller.extend({
  patientsEdit: Ember.inject.controller('patients/edit'),

  title: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('i18n').t('patients.titles.add_photo');
    } else {
      return this.get('i18n').t('patients.titles.edit_photo');
    }
  }.property('model.isNew'),

  updateButtonText: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('i18n').t('buttons.add');
    } else {
      return this.get('i18n').t('buttons.update');
    }
  }.property('model.isNew'),

  updateButtonAction: 'update',
  showUpdateButton: true,

  editController: Ember.computed.alias('patientsEdit'),

  actions: {
    cancel: function() {
      this.send('closeModal');
    },

    update: function() {
      var caption = this.get('model.caption'),
        isNew = this.get('model.isNew'),
        photoFile = this.get('model.photoFile');
      if (isNew) {
        this.get('editController').send('addPhoto', photoFile, caption);
      } else {
        this.get('editController').send('updatePhoto', this.get('model'));
      }
    }
  }
});
