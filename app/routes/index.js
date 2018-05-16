<<<<<<< HEAD
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Navigation from 'hospitalrun/mixins/navigation';
import UserRoles from 'hospitalrun/mixins/user-roles';
import Ember from 'ember';
const { inject, isEmpty } = Ember;

export default Ember.Route.extend(AuthenticatedRouteMixin, Navigation, UserRoles, {
  session: inject.service(),
  beforeModel() {
    let session = this.get('session');
    if (!isEmpty(session)) {
      let role = session.get('data.authenticated.role');
      if (!isEmpty(role)) {
        let userRole = this.findUserRole(role);
        if (!isEmpty(userRole) && !isEmpty(userRole.defaultRoute)) {
          let navelement = this.findNavItemByRoute(userRole.defaultRoute);
          // validate that there really is a navigation element that matches that route.
          if (!isEmpty(navelement)) {
            return this.transitionTo(navelement.route);
          }
        }
      }
    }
    return this._super(...arguments);
  },

  afterModel() {
    this.controllerFor('navigation').set('allowSearch', false);
  },

  actions: {
    createNewUser() {
      return this.transitionTo('users.edit', 'new');
    }
  }
});
=======
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { isEmpty } from '@ember/utils';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Navigation from 'hospitalrun/mixins/navigation';
import UserRoles from 'hospitalrun/mixins/user-roles';

export default Route.extend(AuthenticatedRouteMixin, Navigation, UserRoles, {
  session: service(),
  beforeModel() {
    let session = this.get('session');
    if (!isEmpty(session)) {
      let role = session.get('data.authenticated.role');
      if (!isEmpty(role)) {
        let userRole = this.findUserRole(role);
        if (!isEmpty(userRole) && !isEmpty(userRole.defaultRoute)) {
          let navelement = this.findNavItemByRoute(userRole.defaultRoute);
          // validate that there really is a navigation element that matches that route.
          if (!isEmpty(navelement)) {
            return this.transitionTo(navelement.route);
          }
        }
      }
    }
    return this._super(...arguments);
  },

  afterModel() {
    this.controllerFor('application').set('allowSearch', false);
  },

  actions: {
    createNewUser() {
      return this.transitionTo('users.edit', 'new');
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
