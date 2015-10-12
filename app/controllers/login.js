import Ember from 'ember';
import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';
var LoginController = Ember.Controller.extend(LoginControllerMixin, {
  authenticator: 'authenticator:custom',

  actions: {
    // display an error when logging in fails
    sessionAuthenticationFailed: function(message) {
      this.set('errorMessage', message);
    },

    // handle login success
    sessionAuthenticationSucceeded: function() {
      this.set('errorMessage', '');
      this.set('identification', '');
      this.set('password', '');
      this._super();
    }
  }
}
);

export default LoginController;
