import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractEditRoute.extend(UserSession, {
  editTitle: 'Edit Incident',
  modelName: 'incident',
  newTitle: 'New Incident',

  getNewData: function() {
    return Ember.RSVP.resolve({
      reportedBy: this.getUserName(true)
    });
  }

});
