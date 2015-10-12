import Ember from 'ember';
export default Ember.Route.extend({
  config: Ember.inject.service(),
  beforeModel: function() {
    return this.get('config').useGoogleAuth().then(function(useGoogleAuth) {
      if (useGoogleAuth) {
        window.location.replace('/auth/google');
      }
    });
  }
});
