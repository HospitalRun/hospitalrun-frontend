import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
export default AbstractEditRoute.extend({
  editTitle: 'Edit Incident Category',
  modelName: 'inc-category',
  newTitle: 'New Incident Category',

  getNewData: function() {
    return Ember.RSVP.resolve({
    });
  }

});
