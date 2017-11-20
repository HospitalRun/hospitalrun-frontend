import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
import { set, get } from '@ember/object';
import UserSession from 'hospitalrun/mixins/user-session';
export default Controller.extend(UserSession, {
  config: service(),
  database: service(),
  standAlone: alias('config.standAlone'),
  needsUserSetup: alias('config.needsUserSetup'),
  // on init, look up the list of users and determine if there's a need for a needsUserSetup msg
  init() {
    if (get(this, 'standAlone')) {
      get(this, 'database.usersDB').allDocs().then((results) => {
        if (results.total_rows <= 1) {
          set(this, 'config.needsUserSetup', true);
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
