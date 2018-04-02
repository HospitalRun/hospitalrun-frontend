import Mixin from '@ember/object/mixin';

export default Mixin.create({
  mapOauthParams(params) {
    return {
      config_consumer_key: params.k,
      config_consumer_secret: params.s1,
      config_oauth_token: params.t,
      config_token_secret: params.s2
    };
  }
});
