import AbstractEditRoute from 'hospitalrun/routes/abstract-edit-route';
import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';
export default AbstractEditRoute.extend(UserSession, {
  hideNewButton: true,
  editTitle: 'Load DB',

  beforeModel: function() {
    if (!this.currentUserCan('load_db')) {
      this.transitionTo('application');
    }
  },

  // No model needed for import.
  model: function() {
    return Ember.RSVP.resolve(Ember.Object.create({}));
  }
});
