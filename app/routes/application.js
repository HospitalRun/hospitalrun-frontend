import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import Ember from 'ember';

const {
  inject,
  Route
} = Ember;

var ApplicationRoute = Route.extend(ApplicationRouteMixin, {
    use_google_auth: false,

    actions: {
        authenticateSession: function() {
            if (this.use_google_auth) {
                window.location.replace('/auth/google');
            } else {
                this._super();
            }
        },
        goToLogin() {
          this.transitionTo('login');
        }
    },

    database: inject.service(),
    config: inject.service(),

    model: function(params, transition) {
      const session = this.get('session');
      const isAuthenticated = session && session.isAuthenticated;
      if (isAuthenticated) {
        return this.get('database').setup()
          .then(()=>{
            return this.get('config').setup();
          })
          .catch((error)=>{
            // should handle with an exception
            if (error.name === "unauthorized") {
              if (!Ember.isEmpty(session) && session.isAuthenticated) {
                session.invalidate();
              } else {
                transition.send('goToLogin');
              }
            }
          });
      } else {
        transition.send('goToLogin');
      }
    },

    afterModel: function(resolvedModel) {
        this.controllerFor('navigation').set('allowSearch',false);
        if (resolvedModel) {
            var use_google_auth = resolvedModel.findBy('id','use_google_auth');
            if (use_google_auth) {
                this.use_google_auth = use_google_auth.get('value');
            }
        }
    }

});
export default ApplicationRoute;
