import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import Ember from 'ember';

const { inject, Route } = Ember;

var ApplicationRoute = Route.extend(ApplicationRouteMixin, {
  database: inject.service(),
  config: inject.service(),

  model: function(params, transition) {
    const session = this.get('session');
    const isAuthenticated = session && session.isAuthenticated;
    return this.get('config').setup().then(function(configs) {
      if (transition.targetName !== 'finishgauth' && transition.targetName !== 'login') {
        if (isAuthenticated) {
          return this.get('database').setup(configs)
            .catch(() => {
              // Error thrown indicates missing auth, so invalidate session.
              session.invalidate();
            });
        }
      }
    }.bind(this));
  },

  afterModel: function() {
    this.controllerFor('navigation').set('allowSearch', false);
    $('#apploading').remove();
  }

});
export default ApplicationRoute;
