import Ember from 'ember';
var LoginController = Ember.Controller.extend({
  session: Ember.inject.service(),
  errorMessage: null,
  identification: null,
  password: null,

  actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:custom', {
        identification: identification,
        password: password
      }).catch((reason) => {
        this.set('errorMessage', reason.error);
      });
    }
  }
});

export default LoginController;
