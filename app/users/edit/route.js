import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
export default AbstractEditRoute.extend({
  editTitle: 'Edit User',
  modelName: 'user',
  newTitle: 'New User',

  getNewData: function() {
    return Ember.RSVP.resolve({
      roles: ['Data Entry', 'user']
    });
  }
});
