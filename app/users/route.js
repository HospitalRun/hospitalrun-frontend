import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  actions: {
    allItems: function() {
      this.transitionTo('users.index');
    }
  }
});
