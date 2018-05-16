<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Controller.extend({
  afterDeleteAction: 'closeModal',
  showUpdateButton: true,
  updateButtonText: 'Delete',
  updateButtonAction: 'delete',

  isUpdateDisabled: false,

  actions: {
    cancel() {
      this.send('closeModal');
    },

    delete() {
      let recordToDelete = this.get('model');
      recordToDelete.set('archived', true);
      recordToDelete.save().then(function() {
        recordToDelete.unloadRecord();
        this.send(this.get('afterDeleteAction'), recordToDelete);
      }.bind(this));
    }
  }
});
=======
import Controller from '@ember/controller';
export default Controller.extend({
  afterDeleteAction: 'closeModal',
  showUpdateButton: true,
  updateButtonText: 'Delete',
  updateButtonAction: 'delete',

  isUpdateDisabled: false,

  actions: {
    cancel() {
      this.send('closeModal');
    },

    delete() {
      let recordToDelete = this.get('model');
      recordToDelete.set('archived', true);
      recordToDelete.save().then(function() {
        recordToDelete.destroyRecord().then(() => recordToDelete.unloadRecord());
        this.send(this.get('afterDeleteAction'), recordToDelete);
      }.bind(this));
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
