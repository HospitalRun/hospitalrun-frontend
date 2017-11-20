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
