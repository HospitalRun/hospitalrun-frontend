<<<<<<< HEAD
import Ember from 'ember';
export default Ember.Route.extend({
  model(params) {
    return this.store.find('inventory', params.inventory_id);
  }

});
=======
import Route from '@ember/routing/route';
export default Route.extend({
  model(params) {
    return this.store.find('inventory', params.inventory_id);
  }

});
>>>>>>> 04412e25eaea300a172007bb9619752ed10be2ea
