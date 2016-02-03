import AbstractDeleteController from 'hospitalrun/controllers/abstract-delete-controller';
import Ember from 'ember';
export default AbstractDeleteController.extend({
  afterDeleteAction: 'notifyReviewerDelete',
  editController: Ember.inject.controller('incident/edit'),
  title: 'Delete Reviewer',

  actions: {
    notifyReviewerDelete: function() {
      this.get('model').destroyRecord().then(function() {
        this.send('closeModal');
      }.bind(this));
      this.get('editController').send('deleteReviewer', this.get('model'));
    }
  }
});