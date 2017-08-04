import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

const {
  computed: {
    alias
  },
  get,
  inject,
  Route
} = Ember;

export default Route.extend(UnauthenticatedRouteMixin, {
  config: inject.service(),
  database: inject.service(),

  requireLogin: alias('database.requireLogin'),
  standAlone: alias('config.standAlone'),

  beforeModel(transition) {
    let session = get(this, 'session');
    if (get(session, 'isAuthenticated')) {
      this._super(transition);
    } else {
      let requireLogin = get(this, 'requireLogin');
      let standAlone = get(this, 'standAlone');
      if (standAlone === true && requireLogin === false) {
        return this.get('session').authenticate('authenticator:custom', {
          identification: 'hradmin',
          password: 'test'
        });
      } else {
        return get(this, 'config').useGoogleAuth().then((useGoogleAuth) => {
          if (useGoogleAuth) {
            window.location.replace('/auth/google');
          }
        });
      }
    }
  }
});
