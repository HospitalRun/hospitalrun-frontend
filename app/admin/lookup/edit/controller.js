import Ember from 'ember';
import IsUpdateDisabled from 'hospitalrun/mixins/is-update-disabled';
export default Ember.ObjectController.extend(IsUpdateDisabled, {
  editController: Ember.inject.controller('admin/lookup'),
  showUpdateButton: true,

  title: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
      return 'Add Value';
    } else {
      return 'Edit Value';
    }
  }.property('model.isNew'),

  updateButtonAction: 'update',

  updateButtonText: function() {
    var isNew = this.get('model.isNew');
    if (isNew) {
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
      if (!Ember.isEmpty(this.get('model.value'))) {
        this.get('editController').send('updateValue', this.get('model'));
        this.send('closeModal');
      }
    }
  }
});
