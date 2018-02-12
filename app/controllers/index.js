import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';
const {
  computed: {
    alias
  },
  inject,
  get
} = Ember;

export default Ember.Controller.extend(UserSession, {
  config: inject.service(),
  database: inject.service(),
  standAlone: alias('config.standAlone'),
  needsUserSetup: alias('config.needsUserSetup'),
  // on init, look up the list of users and determine if there's a need for a needsUserSetup msg
  init() {
    if (get(this, 'standAlone')) {
      get(this, 'database.usersDB').allDocs().then((results) => {
        if (results.total_rows <= 1) {
          Ember.run(() => this.set('config.needsUserSetup', true));
        }
      });
    }
  },
  actions: {
    newUser() {
      this.send('createNewUser');
    }
  }
});
