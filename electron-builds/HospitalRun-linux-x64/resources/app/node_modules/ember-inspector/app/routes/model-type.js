import Ember from "ember";
const { RSVP: { Promise } } = Ember;
/*eslint camelcase: 0 */
export default Ember.Route.extend({
  setupController(controller, model) {
    this._super(controller, model);
    this.controllerFor('model-types').set('selected', model);
  },

  model(params) {
    return new Promise(resolve => {
      const type = this.modelFor('model-types').findBy('name', decodeURIComponent(params.type_id));
      if (type) {
        resolve(type);
      } else {
        this.transitionTo('model-types.index');
      }
    });
  },

  deactivate() {
    this.controllerFor('model-types').set('selected', null);
  },

  serialize(model) {
    return { type_id: Ember.get(model, 'name') };
  }
});
