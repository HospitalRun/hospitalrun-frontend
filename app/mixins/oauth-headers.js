import Mixin from '@ember/object/mixin';

export default Mixin.create({
  getOAuthHeaders(configs) {
    return {
      'x-oauth-consumer-secret': configs.config_consumer_secret,
      'x-oauth-consumer-key': configs.config_consumer_key,
      'x-oauth-token-secret': configs.config_token_secret,
      'x-oauth-token': configs.config_oauth_token
    };
  }
});
