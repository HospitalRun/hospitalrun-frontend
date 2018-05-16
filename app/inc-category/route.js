<<<<<<< HEAD
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Ember from 'ember';
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  actions: {
    allItems() {
      this.transitionTo('inc-category.index');
    }
  }
});
=======
import Route from '@ember/routing/route';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
export default Route.extend(AuthenticatedRouteMixin, {
  actions: {
    allItems() {
      this.transitionTo('inc-category.index');
    }
  }
});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
