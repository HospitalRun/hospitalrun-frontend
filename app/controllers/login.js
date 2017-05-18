import Ember from 'ember';
import { isAbortError, isTimeoutError } from 'ember-ajax/errors';

let LoginController = Ember.Controller.extend({
  session: Ember.inject.service(),
  errorMessage: null,
  identification: null,
  password: null,

  actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:custom', {
        identification,
        password
      }).catch((err) => {
        if (isAbortError(err) || isTimeoutError(err)) {
          this.set('errorMessage', false);
          this.set('offlineError', true);
        } else {
          this.set('errorMessage', true);
          this.set('offlineError', false);
        }
      });
    }
  }
});

export default LoginController;
