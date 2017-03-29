import Ember from "ember";
import TabRoute from "ember-inspector/routes/tab";
const { RSVP: { Promise } } = Ember;

export default TabRoute.extend({
  setupController(controller, model) {
    this._super(controller, model);
    this.get('port').on('data:modelTypesAdded', this, this.addModelTypes);
    this.get('port').on('data:modelTypesUpdated', this, this.updateModelTypes);
  },

  model() {
    const port = this.get('port');
    return new Promise(function(resolve) {
      port.one('data:modelTypesAdded', this, function(message) {
        resolve(message.modelTypes);
      });
      port.send('data:getModelTypes');
    });
  },

  deactivate() {
    this.get('port').off('data:modelTypesAdded', this, this.addModelTypes);
    this.get('port').off('data:modelTypesUpdated', this, this.updateModelTypes);
    this.get('port').send('data:releaseModelTypes');
  },

  addModelTypes(message) {
    this.get('currentModel').pushObjects(message.modelTypes);
  },

  updateModelTypes(message) {
    let route = this;
    message.modelTypes.forEach(function(modelType) {
      const currentType = route.get('currentModel').findBy('objectId', modelType.objectId);
      Ember.set(currentType, 'count', modelType.count);
    });
  }
});
