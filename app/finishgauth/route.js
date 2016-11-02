import Ember from 'ember';
import SetupUserRole from 'hospitalrun/mixins/setup-user-role';

export default Ember.Route.extend(SetupUserRole, {
  config: Ember.inject.service(),
  database: Ember.inject.service(),
  session: Ember.inject.service(),
  model: function(params) {
    if (params.k && params.s1 && params.s2 && params.t) {
      this.get('session').authenticate('authenticator:custom', {
        google_auth: true,
        params: params
      });
      let oauthConfigs = {
        config_consumer_key: params.k,
        config_consumer_secret: params.s1,
        config_oauth_token: params.t,
        config_token_secret: params.s2
      };
      return this.get('config').saveOauthConfigs(oauthConfigs)
        .then(function() {
          oauthConfigs.config_use_google_auth = true;
          return this.get('database').setup(oauthConfigs).then(() => {
            return this.setupUserRole();
          });
        }.bind(this));
    }
  }
});
