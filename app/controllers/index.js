import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';
export default Ember.Controller.extend(UserSession, {
  actions: {
    newUser() {
      this.send('createNewUser');
    }
  }
});
