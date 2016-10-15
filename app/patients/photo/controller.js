import Ember from 'ember';
export default Ember.Controller.extend({
  patientsEdit: Ember.inject.controller('patients/edit'),

  title: function() {
    let isNew = this.get('model.isNew');
    if (isNew) {
      return this.get('i18n').t('patients.titles.addPhoto');
    } else {
      return this.get('i18n').t('patients.titles.editPhoto');
    }
  }.property('model.isNew'),

  updateButtonText: function() {
    let isNew = this.get('model.isNew');
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
      let caption = this.get('model.caption');
      let isNew = this.get('model.isNew');
      let photoFile = this.get('model.photoFile');
      if (isNew) {
        this.get('editController').send('addPhoto', photoFile, caption);
      } else {
        this.get('editController').send('updatePhoto', this.get('model'));
      }
    }
  }
});
