import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';

const {
  computed,
  computed: {
    alias
  },
  get,
  inject
} = Ember;
export default Ember.Controller.extend(UserSession, {
  config: Ember.inject.service(),
  standAlone: alias('config.standAlone'),

  needsUserSetup: computed(function() {
    return get(this, 'config').needsUserSetup();
  }).volatile(),
  actions: {
    newUser() {
      this.send('createNewUser');
    }
  }
});
