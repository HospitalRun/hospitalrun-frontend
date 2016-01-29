import Ember from 'ember';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
export default Ember.Controller.extend(IsUpdateDisabled, {
  patientsController: Ember.inject.controller('patients'),

  editController: Ember.computed.alias('patientsController'),
  showUpdateButton: true,
  title: 'Family Info',
  updateButtonAction: 'update',
  updateButtonText: function() {
    if (this.get('model.isNew')) {
      return 'Add';
    } else {
      return 'Update';
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
