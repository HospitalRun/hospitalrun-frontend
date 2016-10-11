import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
export default Ember.Route.extend(UnauthenticatedRouteMixin, {
  config: Ember.inject.service(),
  beforeModel: function(transition) {
    if (this.get('session').get('isAuthenticated')) {
      this._super(transition);
    } else {
      return this.get('config').useGoogleAuth().then(function(useGoogleAuth) {
        if (useGoogleAuth) {
          window.location.replace('/auth/google');
        }
      });
    }
  }
});
