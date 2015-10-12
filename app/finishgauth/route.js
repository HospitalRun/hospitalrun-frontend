import Ember from 'ember';
export default Ember.Route.extend({
  config: Ember.inject.service(),
  database: Ember.inject.service(),

  model: function(params) {
    if (params.k && params.s1 && params.s2 && params.t) {
      this.get('session').authenticate('authenticator:custom', {
        google_auth: true,
        params: params
      });
      var oauthConfigs = {
        config_consumer_key: params.k,
        config_consumer_secret: params.s1,
        config_oauth_token: params.t,
        config_token_secret: params.s2
      };
      return this.get('config').saveOauthConfigs(oauthConfigs)
        .then(function() {
          oauthConfigs.config_use_google_auth = true;
          return this.get('database').setup(oauthConfigs);
        }.bind(this));
    }
  }
});
