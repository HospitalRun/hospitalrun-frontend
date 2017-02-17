import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Navigation from 'hospitalrun/mixins/navigation';
import SetupUserRole from 'hospitalrun/mixins/setup-user-role';
import UserRoles from 'hospitalrun/mixins/user-roles';
import Ember from 'ember';
const { inject } = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, Navigation, SetupUserRole, UserRoles, {
  session: inject.service(),
  beforeModel() {
    // this.setupUserRole();
    let session = this.get('session');
    if (session != null) {
      let role = session.get('data.authenticated.userRole');
      if (role != null) {
        let userRole = this.findUserRole(role);
        if (userRole != null && userRole.defaultRoute != null) {
          let navelement = this.findNavItemByRoute(userRole.defaultRoute);   
          // console.log(`Navigating to ${navelement.route}`);
          // this.controllerFor('navigation').send('navAction', navelement);
          return this.transitionTo(navelement.route);
        }
      } else {
        // console.log(`No ${role} on index route.`);
      }
    } else {
      // console.log('No session on index route.');
    }
    return this._super(...arguments);
  },

  afterModel() {
    this.controllerFor('navigation').set('allowSearch', false);
  }
});
