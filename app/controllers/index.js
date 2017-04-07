import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';

const {
  computed: {
    alias
  },
  inject
} = Ember;
export default Ember.Controller.extend(UserSession, {
  config: inject.service(),
  standAlone: alias('config.standAlone'),
  needsUserSetup: alias('config.needsUserSetup'),
  actions: {
    newUser() {
      this.send('createNewUser');
    }
  }
});
