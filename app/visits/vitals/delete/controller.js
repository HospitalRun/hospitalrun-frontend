import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from 'ember';
export default AbstractDeleteController.extend({
  afterDeleteAction: 'notifyVitalsDelete',
  editController: Ember.inject.controller('visits/edit'),
  title: 'Delete Vitals',

  actions: {
    notifyVitalsDelete: function() {
      this.send('closeModal');
      this.get('editController').send('deleteVitals', this.get('model'));
    }
  }
});
