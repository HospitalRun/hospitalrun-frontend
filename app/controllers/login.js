import Ember from 'ember';
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
      }).catch(() => {
        this.set('errorMessage', true);
      });
    }
  }
});

export default LoginController;
