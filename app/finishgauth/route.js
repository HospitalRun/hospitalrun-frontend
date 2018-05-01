import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import MapOauthParams from 'hospitalrun/mixins/map-oauth-params';
import SetupUserRole from 'hospitalrun/mixins/setup-user-role';

export default Route.extend(MapOauthParams, SetupUserRole, {
  config: service(),
  database: service(),
  session: service(),
  model(params) {
    if (params.k && params.s1 && params.s2 && params.t) {
      this.get('session').authenticate('authenticator:custom', {
        google_auth: true,
        params
      });
    }
  }
});
