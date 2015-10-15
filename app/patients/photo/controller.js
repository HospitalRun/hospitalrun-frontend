import Ember from 'ember';
export default Ember.Controller.extend({
  patientsEdit: Ember.inject.controller('patients/edit'),

  title: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return 'Add Photo';
    } else {
      return 'Edit Photo';
    }
  }.property('model.isNew'),

  updateButtonText: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return 'Add';
    } else {
      return 'Update';
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
      var caption = this.get('caption'),
        isNew = this.get('model.isNew'),
        photoFile = this.get('photoFile');
      if (isNew) {
        this.get('editController').send('addPhoto', photoFile, caption);
      } else {
        this.get('editController').send('updatePhoto', this.get('model'));
      }
    }
  }
});
