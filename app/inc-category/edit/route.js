import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractEditRoute.extend(UserSession, {
  editTitle: 'Edit Incident Category',
  modelName: 'inc-category',
  newTitle: 'New Incident Category',

  getNewData: function() {
    return Ember.RSVP.resolve({
    });
  }

});
