import { inject as service } from '@ember/service';
import { alias } from '@ember/object/computed';
import { get } from '@ember/object';
import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
  config: service(),
  database: service(),

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
