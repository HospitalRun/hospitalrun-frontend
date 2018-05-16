<<<<<<< HEAD
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';
import UserSession from 'hospitalrun/mixins/user-session';
export default Ember.Route.extend(UserSession, AuthenticatedRouteMixin, {
  beforeModel() {
    if (!this.currentUserCan('query_db')) {
      this.transitionTo('application');
    }
  }
});
=======
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import UserSession from 'hospitalrun/mixins/user-session';
export default Route.extend(UserSession, AuthenticatedRouteMixin, {
  beforeModel() {
    if (!this.currentUserCan('query_db')) {
      this.transitionTo('application');
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
