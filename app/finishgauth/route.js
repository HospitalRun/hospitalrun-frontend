import Ember from 'ember';
import MapOauthParams from 'hospitalrun/mixins/map-oauth-params';
import SetupUserRole from 'hospitalrun/mixins/setup-user-role';

export default Ember.Route.extend(MapOauthParams, SetupUserRole, {
  config: Ember.inject.service(),
  database: Ember.inject.service(),
  session: Ember.inject.service(),
  model(params) {
    if (params.k && params.s1 && params.s2 && params.t) {
      this.get('session').authenticate('authenticator:custom', {
        google_auth: true,
        params
      });
    }
  }
});
