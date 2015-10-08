import Ember from 'ember';
export default Ember.ObjectController.extend({
  afterDeleteAction: 'closeModal',
  showUpdateButton: true,
  updateButtonText: 'Delete',
  updateButtonAction: 'delete',

  isUpdateDisabled: false,

  actions: {
    cancel: function () {
      this.send('closeModal');
    },

    delete: function () {
      var recordToDelete = this.get('model');
      this.get('model').destroyRecord().then(function () {
        this.send(this.get('afterDeleteAction'), recordToDelete);
      }.bind(this));
    }
  }
});
