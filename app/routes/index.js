import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  afterModel: function() {
    this.controllerFor('navigation').set('allowSearch', false);
  }
});
