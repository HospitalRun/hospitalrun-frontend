import Ember from 'ember';
export default Ember.Controller.extend({
  afterDeleteAction: 'closeModal',
  showUpdateButton: true,
  updateButtonText: 'Delete',
  updateButtonAction: 'delete',

  isUpdateDisabled: false,

  actions: {
    cancel: function() {
      this.send('closeModal');
    },

    delete: function() {
      var recordToDelete = this.get('model');
      recordToDelete.set('archived', true);
      recordToDelete.update().then(function() {
        this.send(this.get('afterDeleteAction'), recordToDelete);
      }.bind(this));
    }
  }
});
